// src/pages/admin/DashboardPage.jsx
import React, { useEffect, useState } from 'react'
import api from '../../api/axios'  // configured with baseURL: '/api'
import { Bar, Line } from 'react-chartjs-2'

export default function DashboardPage() {
  const [data, setData] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem('token')
    api
      .get('/admin/dashboard', {
        headers: { Authorization: `Bearer ${token}` }
      })
      .then(res => setData(res.data))
      .catch(console.error)
  }, [])

  if (!data) return <p>Loading admin dashboard…</p>

  const { monthly, topBooks, total_confirmed_orders } = data

  return (
    <div className="space-y-8">
      <h1 className="text-2xl font-semibold">Dashboard</h1>
      <div className="grid grid-cols-3 gap-4">
        <div className="p-4 bg-blue-100 rounded">
          <h2 className="font-medium">Confirmed Orders</h2>
          <p className="text-3xl">{total_confirmed_orders}</p>
        </div>
      </div>

      <section>
        <h2 className="font-medium mb-2">Monthly Sales</h2>
        <Line
          data={{
            labels: monthly.map(m=>m.month),
            datasets:[{
              label: 'Sales',
              data: monthly.map(m=>m.monthly_sales),
              fill:false,
              tension:0.2
            }]
          }}
        />
      </section>

      <section>
        <h2 className="font-medium mb-2">Top 10 Books</h2>
        <Bar
          data={{
            labels: topBooks.map(b=>b.book_name),
            datasets:[{
              label: 'Units sold',
              data: topBooks.map(b=>b.total_sold),
              fill:false,
              tension:0.2
            }]
          }}
        />
      </section>
    </div>
  )
}
