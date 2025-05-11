import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function BookListPage() {
  const [books, setBooks] = useState([]);
  useEffect(() => {
    api.get('/books').then(res => setBooks(res.data));
  }, []);
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {books.map(b => (
        <Link key={b.bookID} to={`/books/${b.bookID}`}>
          <div className="border p-2">
            <img src={`data:image/jpeg;base64,${b.image}`} alt="" className="h-40 w-full object-cover"/>
            <h3 className="mt-2">{b.book_name}</h3>
            <p>฿{b.price}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}