import { useEffect, useState } from 'react'
import { Route, Routes, Navigate } from "react-router-dom"
import SignupPage from './pages/SignupPage'
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'

function App() {
  const [authuser, setauthuser] = useState(null)
  const [loading, setLoading] = useState(true)

  const chechauth = async () => {
    try {
      const res = await fetch("https://panscience-assignment-nfvf.onrender.com/api/auth/check", {
        method: "GET",
        credentials: 'include',
        headers: { "Content-Type": "application/json" }
      })

      if (res.ok) {
        const data = await res.json()
        setauthuser(data)
      } else {
        setauthuser(null)
      }
    } catch (error) {
      console.log(error)
      setauthuser(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    chechauth()
  }, [])
  if (loading) {
    return <div className="fixed inset-0  bg-opacity-60 flex items-center justify-center z-[1000]">
  <div className="flex flex-col items-center justify-center space-y-4">
    <div className="w-16 h-16 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
    <div className="flex space-x-2">
      <div className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
      <div className="w-3 h-3 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
      <div className="w-3 h-3 bg-black rounded-full animate-bounce"></div>
    </div>
  </div>
</div>
  }
  return (
    <Routes>
      <Route path="/" element={authuser ? <HomePage authuser={authuser}/> : <Navigate to="/login"/>} />
      <Route path="/signup" element={!authuser ? <SignupPage /> : <Navigate to="/" />} />
      <Route path="/login" element={!authuser ? <LoginPage  setauthuser={setauthuser} /> : <Navigate to="/" />} />
    </Routes>
  )
}

export default App
