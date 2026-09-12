import { Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Check from './pages/Check'
import ToastContainer from './components/ToastContainer'
import Dashboard from './pages/Dashboard'
import Empleados from './pages/Empleados.jsx'
import { RequireAuth, RequireAdmin, RequireCheckedIn } from './components/Guards.jsx'

import './App.css'

function App() {
  

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
          <Route path="/empleados" element={
            <RequireAuth>
              <RequireAdmin>
                <Empleados />
              </RequireAdmin>
            </RequireAuth>
            } 
          />

       
        
      </Routes>
    </div>
  )
}

export default App