import { BrowserRouter } from 'react-router-dom'
import { AppRoutes } from './routes'
import { AppProvider } from './context/AppContext'

function App() {
  return (
    <AppProvider>
      <BrowserRouter basename={import.meta.env.BASE_URL}>
        <div className="min-h-screen bg-background font-sans">
          <AppRoutes />
        </div>
      </BrowserRouter>
    </AppProvider>
  )
}

export default App
