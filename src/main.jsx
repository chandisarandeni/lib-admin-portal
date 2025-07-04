import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom' // ✅ import this
import './index.css'
import App from './App.jsx'
import ContextProvider from './context/AppContext.jsx'

createRoot(document.getElementById('root')).render(

    <BrowserRouter> {/* ✅ wrap App with BrowserRouter */}
      <ContextProvider>
        <App />
      </ContextProvider>
    </BrowserRouter>,
)
