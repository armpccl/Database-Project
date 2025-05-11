import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function OrderMgmtPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => api.get('/admin/orders').then(r => setOrders(r.data)), []);

  const updateStatus = (id, status) => api.put(`/admin/orders/${id}/status`, { status }).then(() => {
    setOrders(o => o.map(x => x.orderID === id ? { ...x, status } : x));
  });
  const remove = id => api.delete(`/admin/orders/${id}`).then(() => setOrders(o => o.filter(x => x.orderID !== id)));

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Order Management</h1>
      <table className="w-full table-auto">
        <thead><tr><th>ID</th><th>Total</th><th>Status</th><th>Actions</th></tr></thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.orderID} className="hover:bg-gray-100">
              <td>{o.orderID}</td>
              <td>{o.total_price}</td>
              <td>{o.status}</td>
              <td className="space-x-2">
                <button onClick={() => updateStatus(o.orderID, 'Shipped')} className="text-blue-500">Ship</button>
                <button onClick={() => remove(o.orderID)} className="text-red-500" disabled={o.status === 'Delivered'}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}