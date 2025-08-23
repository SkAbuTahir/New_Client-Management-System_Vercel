// "use client";
// import { useState, useEffect } from "react";

// export function useLocalStorage(key, initialValue) {
//   const [storedValue, setStoredValue] = useState(initialValue);

//   useEffect(() => {
//     try {
//       if (typeof window !== "undefined") {
//         const item = window.localStorage.getItem(key);
//         setStoredValue(item ? JSON.parse(item) : initialValue);
//       }
//     } catch (error) {
//       console.error("Error reading localStorage:", error);
//     }
//   }, [key, initialValue]);

//   const setValue = (value) => {
//     try {
//       setStoredValue(value);
//       if (typeof window !== "undefined") {
//         window.localStorage.setItem(key, JSON.stringify(value));
//       }
//     } catch (error) {
//       console.error("Error setting localStorage:", error);
//     }
//   };

//   return [storedValue, setValue];
// }


'use client'
import { useState, useEffect } from 'react'

export function useLocalStorage(key, initialValue) {
  const [storedValue, setStoredValue] = useState(() => {
    // Return initial value during SSR
    if (typeof window === 'undefined') {
      return initialValue
    }
    return initialValue
  })

  useEffect(() => {
    // Run only in browser
    if (typeof window !== 'undefined') {
      try {
        const item = window.localStorage.getItem(key)
        if (item) {
          setStoredValue(JSON.parse(item))
        }
      } catch (error) {
        console.error("Error reading localStorage", error)
      }
    }
  }, [key])

  const setValue = (value) => {
    try {
      setStoredValue(value)
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, JSON.stringify(value))
      }
    } catch (error) {
      console.error("Error writing localStorage", error)
    }
  }

  return [storedValue, setValue]
}
