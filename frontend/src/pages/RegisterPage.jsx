// src/pages/RegisterPage.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axios';

export default function RegisterPage() {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    fname: '',
    lname: '',
    phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    // 1) เช็ค password match
    if (form.password !== form.confirmPassword) {
      setError('Password กับ Confirm Password ไม่ตรงกัน');
      return;
    }
    // 2) เช็คความยาว password
    if (form.password.length < 6) {
      setError('Password ต้องมีอย่างน้อย 6 ตัวอักษร');
      return;
    }
    // 3) เช็ค phone 10 หลัก
    if (!/^\d{10}$/.test(form.phone)) {
      setError('เบอร์โทรต้องเป็นตัวเลข 10 หลักเท่านั้น');
      return;
    }

    try {
      // เรียก API ฝั่ง backend
      await api.post('/auth/register', {
        username: form.username,
        email: form.email,
        password: form.password,
        fname: form.fname,
        lname: form.lname,
        phone: form.phone
      });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-8">
        <h2 className="text-2xl font-semibold mb-6 text-center">Create Account</h2>

        {error && (
          <div className="mb-4 text-red-600 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Username */}
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              name="username"
              type="text"
              value={form.username}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium mb-1">Confirm Password</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* First Name */}
          <div>
            <label className="block text-sm font-medium mb-1">First Name</label>
            <input
              name="fname"
              type="text"
              value={form.fname}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-sm font-medium mb-1">Last Name</label>
            <input
              name="lname"
              type="text"
              value={form.lname}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium mb-1">Phone</label>
            <input
              name="phone"
              type="text"
              placeholder="0812345678"
              value={form.phone}
              onChange={handleChange}
              className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
              required
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Register
          </button>
        </form>

        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
