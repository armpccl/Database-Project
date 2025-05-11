import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../api/axios'

export default function ProfilePage() {
  const [profile, setProfile] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate               = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem('token')
    if (!token) {
      navigate('/login', { replace: true })
      return
    }

    api.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(res => setProfile(res.data))
      .catch(() => {
        localStorage.removeItem('token')
        navigate('/login', { replace: true })
      })
      .finally(() => setLoading(false))
  }, [navigate])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading profile…</p>
      </div>
    )
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded shadow">
      <h2 className="text-2xl font-semibold mb-4">Your Profile</h2>
      <p><strong>Username:</strong> {profile.username}</p>
      <p><strong>Email:</strong>    {profile.email}</p>
      <p><strong>First Name:</strong> {profile.fname}</p>
      <p><strong>Last Name:</strong>  {profile.lname}</p>
      <p><strong>Phone:</strong>      {profile.phone}</p>

      <button
        onClick={() => {
          localStorage.removeItem('token')
          navigate('/', { replace: true })
        }}
        className="mt-6 px-4 py-2 bg-red-500 text-white rounded"
      >
        Logout
      </button>
    </div>
  )
}
