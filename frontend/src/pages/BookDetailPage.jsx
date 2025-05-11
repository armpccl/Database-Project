import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function BookDetailPage() {
  const { id } = useParams();
  const [book, setBook] = useState(null);
  useEffect(() => {
    api.get(`/books/${id}`).then(res => setBook(res.data));
  }, [id]);
  if (!book) return null;
  return (
    <div className="flex space-x-6">
      <img src={`data:image/jpeg;base64,${book.image}`} alt="" className="w-1/3"/>
      <div className="flex-1">
        <h1 className="text-2xl font-bold">{book.book_name}</h1>
        <p>By {book.author}</p>
        <p className="mt-4">{book.description}</p>
        <p className="mt-2 text-xl">฿{book.price}</p>
      </div>
    </div>
  );
}