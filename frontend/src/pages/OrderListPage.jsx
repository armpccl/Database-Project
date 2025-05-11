import { useEffect, useState } from 'react';
import api from '../api/axios';
import { Link } from 'react-router-dom';

export default function OrderListPage() {
  const [orders, setOrders] = useState([]);
  useEffect(() => { api.get('/orders').then(res=>setOrders(res.data)); }, []);
  return orders.map(o=><div key={o.orderID}><Link to={`/orders/${o.orderID}`}>Order #{o.orderID} - {o.status}</Link></div>);
}