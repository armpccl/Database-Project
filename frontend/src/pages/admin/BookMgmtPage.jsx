import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function BookMgmtPage() {
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({ book_name: '', author: '', price: '' });

  const fetch = () => api.get('/admin/books').then(r => setBooks(r.data));
  useEffect(fetch, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));
  const add = () => api.post('/admin/books', form).then(fetch);
  const remove = id => api.delete(`/admin/books/${id}`).then(fetch);

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Product Management</h1>
      <div className="mb-4 space-x-2">
        <input name="book_name" placeholder="Name" onChange={handleChange} className="border px-2" />
        <input name="author" placeholder="Author" onChange={handleChange} className="border px-2" />
        <input name="price" placeholder="Price" onChange={handleChange} className="border px-2" />
        <button onClick={add} className="bg-blue-500 text-white px-4">Add</button>
      </div>
      <table className="w-full table-auto">
        <thead><tr><th>ID</th><th>Name</th><th>Author</th><th>Price</th><th>Actions</th></tr></thead>
        <tbody>
          {books.map(b => (
            <tr key={b.bookID} className="hover:bg-gray-100">
              <td>{b.bookID}</td>
              <td>{b.book_name}</td>
              <td>{b.author}</td>
              <td>{b.price}</td>
              <td><button onClick={() => remove(b.bookID)} className="text-red-500">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}