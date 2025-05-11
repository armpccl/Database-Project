import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function PromotionMgmtPage() {
  const [promos, setPromos] = useState([]);
  const [form, setForm] = useState({ name: '', discount_value: '' });

  const fetch = () => api.get('/admin/coupons').then(r => setPromos(r.data));
  useEffect(fetch, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const add = () => api.post('/admin/coupons', form).then(fetch);
  const remove = id => api.delete(`/admin/coupons/${id}`).then(fetch);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Promotion Management</h1>
      <div className="mb-4 space-x-2">
        <input name="name" placeholder="Name" onChange={handleChange} className="border px-2" />
        <input name="discount_value" placeholder="Discount" onChange={handleChange} className="border px-2" />
        <button onClick={add} className="bg-blue-500 text-white px-4">Add</button>
      </div>
      <table className="w-full table-auto">
        <thead><tr><th>ID</th><th>Name</th><th>Discount</th><th>Actions</th></tr></thead>
        <tbody>
          {promos.map(p => (
            <tr key={p.couponID} className="hover:bg-gray-100">
              <td>{p.couponID}</td>
              <td>{p.name}</td>
              <td>{p.discount_value}</td>
              <td><button onClick={() => remove(p.couponID)} className="text-red-500">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}