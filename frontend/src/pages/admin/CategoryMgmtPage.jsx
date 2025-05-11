import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function CategoryMgmtPage() {
  const [cats, setCats] = useState([]);
  const [name, setName] = useState('');

  const fetch = () => api.get('/admin/categories').then(r => setCats(r.data));
  useEffect(fetch, []);
  const add = () => api.post('/admin/categories', { name }).then(fetch);
  const remove = id => api.delete(`/admin/categories/${id}`).then(fetch);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Category Management</h1>
      <div className="mb-4">
        <input placeholder="Name" value={name} onChange={e => setName(e.target.value)} className="border px-2" />
        <button onClick={add} className="bg-blue-500 text-white px-4 ml-2">Add</button>
      </div>
      <ul>
        {cats.map(c => (
          <li key={c.categoryID} className="flex justify-between py-1">
            {c.name} <button onClick={() => remove(c.categoryID)} className="text-red-500">Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
}
