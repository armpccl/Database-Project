import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function CustomerMgmtPage() {
  const [customers, setCustomers] = useState([]);

  const fetch = () => api.get('/admin/customers').then(r => setCustomers(r.data));
  useEffect(fetch, []);

  const remove = id => api.delete(`/admin/customers/${id}`).then(fetch);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Customer Management</h1>
      <table className="w-full table-auto">
        <thead><tr><th>ID</th><th>Username</th><th>Email</th><th>Actions</th></tr></thead>
        <tbody>
          {customers.map(c => (
            <tr key={c.customerID} className="hover:bg-gray-100">
              <td>{c.customerID}</td>
              <td>{c.username}</td>
              <td>{c.email}</td>
              <td>
                <button onClick={() => remove(c.customerID)} className="text-red-500">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}