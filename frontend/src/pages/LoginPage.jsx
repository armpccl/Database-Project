// src/pages/LoginPage.jsx
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'
import { jwtDecode } from 'jwt-decode'

export default function LoginPage() {
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const navigate                = useNavigate()

  const handleSubmit = async e => {
    e.preventDefault()
    setError('')
    try {
      const { data } = await api.post('/auth/login', { email, password })
      const { token } = data
      localStorage.setItem('token', token)

      // decode role out of JWT
      const { role } = jwtDecode(token)

      // if roleID=1 → role==='admin'
      if (role === 'admin') {
        navigate('/admin', { replace: true })
      } else {
        navigate('/', { replace: true })
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl mb-4 text-center">Sign In</h1>
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <label className="block mb-2">
          Email
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <label className="block mb-4">
          Password
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="mt-1 p-2 w-full border rounded"
          />
        </label>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Sign In
        </button>
      </form>
    </div>
  )
}
