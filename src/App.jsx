import { useState } from 'react'
import { useAuth } from './context/AuthContext.jsx'
import Login from './pages/Login'

import './App.css'

function App() {

  const { user } = useAuth()
  console.log('Usuario actual:', user)
  
  return (
    <div className="bg-bg w-full h-screen flex items-center justify-center">
      <Login/>

    </div >
  )
}

export default App
