import { Routes, Route } from 'react-router-dom'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login'
import Check from './pages/Check'
import ToastContainer from './components/ToastContainer'
// Importa aquí tus otras páginas para el redireccionamiento, por ejemplo:
// import AdminDashboard from './pages/AdminDashboard'
// import UserDashboard from './pages/UserDashboard'

import './App.css'

function App() {
  const { user } = useAuth()
  console.log('Usuario actual:', user)

  return (
    <div className="bg-bg w-full h-screen flex items-center justify-center">
      <ToastContainer />
      {/* // contenedor de rutas */}
      <Routes>
       
        <Route path="/" element={<Login />} />
        <Route path="/check" element={<Check />} />

       
        
      </Routes>
    </div>
  )
}

export default App