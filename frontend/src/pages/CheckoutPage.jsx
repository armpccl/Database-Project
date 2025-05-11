import { useState } from 'react';
import api from '../api/axios';
import { useNavigate } from 'react-router-dom';

export default function CheckoutPage() {
  const [method, setMethod] = useState('qr');
  const nav = useNavigate();

  const handleOrder = async () => {
    const { data } = await api.post('/orders', { payment_method: method });
    nav(`/orders/${data.orderID}`);
  };

  return (
    <div>
      <h2>Checkout</h2>
      <label><input type="radio" name="m" value="qr" onChange={()=>setMethod('qr')} checked /> QR Code</label>
      <label><input type="radio" name="m" value="card" onChange={()=>setMethod('card')} /> Credit Card</label>
      <button onClick={handleOrder}>Confirm</button>
    </div>
  );
}
