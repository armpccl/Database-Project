// src/context/AuthProvider.jsx
import React, { createContext, useState } from 'react'

export const AuthContext = createContext({
  user: null,
  setUser: () => {}
})

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null)

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  )
}
