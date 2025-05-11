// src/App.js
import React from 'react'
import { BrowserRouter, Routes, Route, Navigate, Outlet } from 'react-router-dom'

import Layout         from './components/Layout'
import AdminLayout    from './components/AdminLayout'
import ProtectedRoute from './components/ProtectedRoute'

import HomePage        from './pages/HomePage'
import LoginPage       from './pages/LoginPage'
import RegisterPage    from './pages/RegisterPage'
import QnAPage         from './pages/QnAPage'
import ProfilePage     from './pages/ProfilePage'
import BookListPage    from './pages/BookListPage'
import BookDetailPage  from './pages/BookDetailPage'
import CartPage        from './pages/CartPage'
import CheckoutPage    from './pages/CheckoutPage'
import OrderListPage   from './pages/OrderListPage'
import OrderDetailPage from './pages/OrderDetailPage'

// Admin pages
import DashboardPage     from './pages/admin/DashboardPage'
import CustomerMgmtPage  from './pages/admin/CustomerMgmtPage'
import BookMgmtPage      from './pages/admin/BookMgmtPage'
import CategoryMgmtPage  from './pages/admin/CategoryMgmtPage'
import OrderMgmtPage     from './pages/admin/OrderMgmtPage'
import ReviewMgmtPage    from './pages/admin/ReviewMgmtPage'
import ShippingMgmtPage  from './pages/admin/ShippingMgmtPage'
import PromotionMgmtPage from './pages/admin/PromotionMgmtPage'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* Public routes under the main Layout */}
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="login"    element={<LoginPage />} />
          <Route path="register" element={<RegisterPage />} />
          <Route path="contact"  element={<QnAPage />} />

          {/* User‐only routes */}
          <Route element={<ProtectedRoute><Outlet/></ProtectedRoute>}>
            <Route path="profile"    element={<ProfilePage />} />
            <Route path="books"      element={<BookListPage />} />
            <Route path="books/:id"  element={<BookDetailPage />} />
            <Route path="cart"       element={<CartPage />} />
            <Route path="checkout"   element={<CheckoutPage />} />
            <Route path="orders"     element={<OrderListPage />} />
            <Route path="orders/:id" element={<OrderDetailPage />} />
          </Route>
        </Route>

        {/* Admin routes (same token but role="admin" required) */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index          element={<DashboardPage />} />
          <Route path="customers"  element={<CustomerMgmtPage />} />
          <Route path="books"      element={<BookMgmtPage />} />
          <Route path="categories" element={<CategoryMgmtPage />} />
          <Route path="orders"     element={<OrderMgmtPage />} />
          <Route path="reviews"    element={<ReviewMgmtPage />} />
          <Route path="shipping"   element={<ShippingMgmtPage />} />
          <Route path="promotions" element={<PromotionMgmtPage />} />
        </Route>

        {/* Catch-all: redirect any unknown URL back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  )
}
