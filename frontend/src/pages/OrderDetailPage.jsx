import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';

export default function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);

  useEffect(() => { api.get(`/orders/${id}`).then(res=>setOrder(res.data)); }, [id]);
  if (!order) return <p>Loading...</p>;
  const { order: o, items } = order;
  return (
    <div>
      <h2>Order #{o.orderID}</h2>
      <p>Status: {o.status}</p>
      <ul>{items.map(i=><li key={i.bookID}>{i.book_name} x{i.quantity}</li>)}</ul>
    </div>
  );
}
