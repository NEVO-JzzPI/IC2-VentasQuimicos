import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login'
import Check from './pages/Check'
import ToastContainer from './components/ToastContainer'
import Dashboard from './pages/Dashboard'
import { RequireAuth, RequireAdmin, RequireCheckedIn } from './components/Guards.jsx'

import './App.css'

function App() {
  const { user } = useAuth()
  console.log('Usuario actual:', user)

  return (
    <div className="bg-bg w-full min-h-screen">
      <ToastContainer />
      {/* // contenedor de rutas */}
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/check" element={
          <RequireAuth>
            <Check />
          </RequireAuth>
          } />
        <Route path="/dashboard" element={

            <RequireAuth>
              <RequireAdmin>
                <RequireCheckedIn>
                  <Dashboard />
                </RequireCheckedIn>
              </RequireAdmin>
            </RequireAuth>
          } />

       
        
      </Routes>
    </div>
  )
}

export default App