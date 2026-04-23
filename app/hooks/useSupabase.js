'use client'
import { useState, useEffect, useCallback, useRef } from 'react'

const API_MAP = {
  clients:        '/api/clients',
  projects:       '/api/projects',
  communications: '/api/communications',
  invoices:       '/api/invoices',
}

// camelCase → snake_case for DB writes
function toSnake(obj) {
  const map = {
    clientId: 'client_id', clientName: 'client_name',
    projectId: 'project_id', projectName: 'project_name',
    invoiceNumber: 'invoice_number',
    startDate: 'start_date', endDate: 'end_date',
    issueDate: 'issue_date', dueDate: 'due_date',
    followUp: 'follow_up',
  }
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    // skip undefined/null timestamps — DB sets these automatically
    if (['createdAt', 'updatedAt', 'created_at', 'updated_at'].includes(k)) continue
    result[map[k] || k] = v
  }
  return result
}

// snake_case → camelCase for frontend
function toCamel(obj) {
  const map = {
    client_id: 'clientId', client_name: 'clientName',
    project_id: 'projectId', project_name: 'projectName',
    invoice_number: 'invoiceNumber',
    start_date: 'startDate', end_date: 'endDate',
    issue_date: 'issueDate', due_date: 'dueDate',
    follow_up: 'followUp',
    created_at: 'createdAt', updated_at: 'updatedAt',
  }
  const result = {}
  for (const [k, v] of Object.entries(obj)) {
    result[map[k] || k] = v
  }
  return result
}

export function useSupabase(key, initialValue = []) {
  const [data, setData] = useState(initialValue)
  const [loading, setLoading] = useState(true)
  const endpoint = API_MAP[key]
  // Keep a ref so setValue closure always sees latest data
  const dataRef = useRef(data)
  useEffect(() => { dataRef.current = data }, [data])

  // ── Fetch all from API ─────────────────────────────────────
  const fetchData = useCallback(async () => {
    if (!endpoint) { setLoading(false); return }
    try {
      const res = await fetch(endpoint)
      if (!res.ok) throw new Error(await res.text())
      const rows = await res.json()
      const camel = rows.map(toCamel)
      setData(camel)
      // keep localStorage in sync as offline fallback
      try { localStorage.setItem(key, JSON.stringify(camel)) } catch {}
    } catch {
      // fallback to localStorage
      try {
        const item = localStorage.getItem(key)
        if (item) setData(JSON.parse(item))
      } catch {}
    } finally {
      setLoading(false)
    }
  }, [endpoint, key])

  useEffect(() => { fetchData() }, [fetchData])

  // ── setValue — same API as useLocalStorage ─────────────────
  // Detects add / update / delete by comparing with current data
  const setValue = useCallback(async (valueOrUpdater) => {
    const prev = dataRef.current
    const next = typeof valueOrUpdater === 'function' ? valueOrUpdater(prev) : valueOrUpdater

    // Optimistic update immediately so UI feels instant
    setData(next)
    try { localStorage.setItem(key, JSON.stringify(next)) } catch {}

    if (!endpoint) return

    const prevMap = new Map(prev.map(r => [r.id, r]))
    const nextMap = new Map(next.map(r => [r.id, r]))

    // ── DELETE: in prev but not in next ──
    for (const id of prevMap.keys()) {
      if (!nextMap.has(id)) {
        await fetch(`${endpoint}/${id}`, { method: 'DELETE' })
      }
    }

    // ── INSERT: in next but not in prev ──
    for (const item of next) {
      if (!prevMap.has(item.id)) {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(toSnake(item)),
        })
        if (res.ok) {
          // Re-fetch so the real DB id replaces the temp Date.now() id
          await fetchData()
          return
        }
      }
    }

    // ── UPDATE: in both but changed ──
    for (const item of next) {
      if (prevMap.has(item.id)) {
        const old = prevMap.get(item.id)
        if (JSON.stringify(old) !== JSON.stringify(item)) {
          await fetch(`${endpoint}/${item.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(toSnake(item)),
          })
        }
      }
    }

    // Re-fetch after update to stay in sync
    await fetchData()
  }, [endpoint, key, fetchData])

  return [data, setValue, { loading, refetch: fetchData }]
}
