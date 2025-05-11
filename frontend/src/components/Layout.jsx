import React, { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Menu, Home, User, ShoppingCart, X } from 'lucide-react'

export default function Layout() {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  let username = null
  if (token) {
    try {
      const { username: u } = JSON.parse(atob(token.split('.')[1]))
      username = u
    } catch {}
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    setDrawerOpen(false)
    navigate('/login', { replace: true })
  }

  return (
    <div className="flex flex-col min-h-screen">
      {/* Top Bar */}
      <header className="border-b bg-white">
        <div className="container mx-auto px-4 flex items-center justify-between h-16">
          {/* Hamburger + Home */}
          <div className="flex items-center">
            <button className="md:hidden p-2" onClick={() => setDrawerOpen(true)}>
              <Menu className="h-6 w-6 text-gray-600" />
            </button>
            <Link to="/" className="ml-2">
              <Home className="h-8 w-8 text-gray-600" />
            </Link>
          </div>
          {/* Search (desktop) */}
          <div className="hidden md:flex flex-1 mx-8">
            <input
              type="search"
              placeholder="Search"
              className="w-full border rounded px-3 py-2"
            />
          </div>
          {/* Icons */}
          <div className="flex items-center space-x-4">
            <button
              className="p-2"
              onClick={() => navigate(username ? '/profile' : '/login')}
            >
              <User className="h-6 w-6 text-gray-600" />
            </button>
            <button className="p-2" onClick={() => navigate('/cart')}>
              <ShoppingCart className="h-6 w-6 text-gray-600" />
            </button>
          </div>
        </div>
      </header>

      {/* Drawer */}
      {drawerOpen && (
        <div className="fixed inset-0 z-40 flex bg-black/20">
          <aside className="w-64 bg-white p-6 shadow-lg flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-600" />
                <span className="font-semibold">
                  {username ? `Hello, ${username}` : 'Hello, User'}
                </span>
              </div>
              <button onClick={() => setDrawerOpen(false)}>
                <X className="h-6 w-6 text-gray-600" />
              </button>
            </div>

            {/* Auth Links */}
            <nav className="flex flex-col space-y-2 mb-6">
              {username ? (
                <>
                  <Link
                    to="/profile"
                    className="px-2 py-1 hover:bg-gray-100 rounded"
                    onClick={() => setDrawerOpen(false)}
                  >
                    Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-red-500 text-left px-2 py-1 hover:underline"
                  >
                    Sign Out
                  </button>
                </>
              ) : (
                <Link
                  to="/login"
                  className="px-2 py-1 hover:bg-gray-100 rounded"
                  onClick={() => setDrawerOpen(false)}
                >
                  Sign In
                </Link>
              )}
            </nav>

            {/* Here you could list categories if you wish */}
          </aside>
          <div className="flex-1" onClick={() => setDrawerOpen(false)} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 container mx-auto p-4">
        <Outlet />
      </main>
    </div>
  )
}
