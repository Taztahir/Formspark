import React from 'react'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './context/AuthContext'
import AppRouter from './router/AppRouter'
import ScrollToTop from './components/ui/ScrollToTop'

function App() {
  return (
    <AuthProvider>
      <ScrollToTop />
      <Toaster 
        position="top-center"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#09090b',
            color: '#fff',
            border: '1px solid #27272a',
            borderRadius: '8px',
            padding: '12px 20px',
            fontSize: '11px',
            textTransform: 'uppercase',
            letterSpacing: '0.05em',
            fontWeight: '700',
          },
          success: {
            iconTheme: {
              primary: '#fff',
              secondary: '#000',
            },
          },
        }}
      />
      <AppRouter />
    </AuthProvider>
  )
}

export default App
