import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ReviewMgmtPage() {
  const [reviews, setReviews] = useState([]);
  useEffect(() => api.get('/admin/reviews').then(r => setReviews(r.data)), []);

  const remove = (bookID, customerID) => api.delete(`/admin/reviews/${bookID}/${customerID}`).then(() => {
    setReviews(r => r.filter(x => !(x.bookID===bookID && x.customerID===customerID)));
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Review Management</h1>
      <table className="w-full table-auto">
        <thead><tr><th>BookID</th><th>CustomerID</th><th>Rating</th><th>Comment</th><th>Actions</th></tr></thead>
        <tbody>
          {reviews.map(r => (
            <tr key={`${r.bookID}-${r.customerID}`} className="hover:bg-gray-100">
              <td>{r.bookID}</td>
              <td>{r.customerID}</td>
              <td>{r.rating}</td>
              <td>{r.comment}</td>
              <td><button onClick={() => remove(r.bookID, r.customerID)} className="text-red-500">Delete</button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}