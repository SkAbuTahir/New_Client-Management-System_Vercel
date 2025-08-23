// 'use client'
// import dynamic from 'next/dynamic'

// const ClientApp = dynamic(() => import('./components/ClientApp'), {
//   ssr: false,
//   loading: () => (
//     <div className="min-vh-100 d-flex align-items-center justify-content-center">
//       <div className="text-center">
//         <div className="spinner-border text-primary mb-3" role="status">
//           <span className="visually-hidden">Loading...</span>
//         </div>
//         <p className="text-muted">Loading application...</p>
//       </div>
//     </div>
//   )
// })

// export default function Home() {
//   return <ClientApp />
// }

'use client'
import dynamic from 'next/dynamic'
import ClientWrapper from './components/ClientWrapper'

const MainApp = dynamic(() => import('./components/MainApp'), {
  ssr: false,
  loading: () => (
    <div className="min-vh-100 d-flex align-items-center justify-content-center">
      <div className="text-center">
        <div className="spinner-border text-primary mb-3" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="text-muted">Loading application...</p>
      </div>
    </div>
  )
})

export default function Home() {
  return (
    <ClientWrapper>
      <MainApp />
    </ClientWrapper>
  )
}
