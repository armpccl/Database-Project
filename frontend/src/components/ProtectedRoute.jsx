// src/components/ProtectedRoute.jsx
import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'

export default function ProtectedRoute({ children, role }) {
  const location = useLocation()
  const token = localStorage.getItem('token')

  // 1) Not logged in?
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  let payload
  try {
    payload = jwtDecode(token)
  } catch (e) {
    // invalid token → clear & re-login
    localStorage.removeItem('token')
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  // 2) If this route needs an "admin" check…
  if (role === 'admin' && payload.role !== 'admin') {
    // not an admin → kick back to home
    return <Navigate to="/" replace />
  }

  // 3) All clear
  return children
}
