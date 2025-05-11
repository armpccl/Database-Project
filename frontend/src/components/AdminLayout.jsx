import React from 'react'
import { Link, Outlet } from 'react-router-dom'
import { jwtDecode } from 'jwt-decode'
import {
  User as UserIcon,
  Grid as DashboardIcon,
  Users as CustomerIcon,
  Book as BookIcon,
  Tag as CategoryIcon,
  ShoppingCart as OrderIcon,
  Star as ReviewIcon,
  Truck as ShippingIcon,
  Gift as PromotionIcon,
  LogOut as LogoutIcon
} from 'lucide-react'

export default function AdminLayout() {
  // decode username out of the token so we can greet them
  let username = 'Admin'
  const token = localStorage.getItem('token')
  if (token) {
    try {
      const { username: name } = jwtDecode(token)
      username = name
    } catch {}
  }

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-50 border-r">
        <div className="px-4 py-6 flex items-center border-b">
          <UserIcon className="w-6 h-6 mr-2 text-gray-700" />
          <span className="font-semibold text-gray-800">Hello, {username}</span>
        </div>
        <nav className="mt-4 space-y-1">
          {[
            { to: '/admin',         label: 'Dashboard',    icon: <DashboardIcon/> },
            { to: '/admin/customers',label: 'Customers',    icon: <CustomerIcon/> },
            { to: '/admin/books',    label: 'Books',        icon: <BookIcon/> },
            { to: '/admin/categories', label: 'Category',   icon: <CategoryIcon/> },
            { to: '/admin/orders',   label: 'Order',        icon: <OrderIcon/> },
            { to: '/admin/reviews',  label: 'Rating & Review', icon: <ReviewIcon/> },
            { to: '/admin/shipping', label: 'Shipping & Delivery', icon: <ShippingIcon/> },
            { to: '/admin/promotions',label: 'Promotion',   icon: <PromotionIcon/> },
          ].map(({ to, label, icon }) => (
            <Link
              key={to}
              to={to}
              className="flex items-center px-4 py-2 hover:bg-gray-100 text-gray-700"
            >
              <span className="mr-3">{icon}</span>
              {label}
            </Link>
          ))}
        </nav>
        <div className="absolute bottom-0 w-full mb-6">
          <button
            onClick={() => {
              localStorage.removeItem('token')
              window.location.href = '/login'
            }}
            className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-50"
          >
            <LogoutIcon className="mr-2" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 p-6 bg-white">
        <Outlet />
      </main>
    </div>
  )
}
