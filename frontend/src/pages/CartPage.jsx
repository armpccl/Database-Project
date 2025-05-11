import React, { useEffect, useState } from 'react';
import api from '../api/axios';

export default function CartPage() {
  const [items, setItems] = useState([]);
  const [coupon, setCoupon] = useState('');
  const [total, setTotal] = useState(0);

  const fetchCart = () => {
    api.get('/cart').then(res => {
      setItems(res.data);
      const sum = res.data.reduce((s, i) => s + i.price * i.quantity, 0);
      setTotal(sum);
    });
  };

  useEffect(fetchCart, []);

  const remove = bookID => {
    api.delete(`/cart/${bookID}`).then(fetchCart);
  };

  const applyCoupon = () => {
    api.post('/cart/coupon', { couponCode: coupon }).then(fetchCart);
  };

  return (
    <div className="space-y-4 max-w-lg mx-auto">
      <h2 className="text-2xl font-semibold">ตะกร้าสินค้า</h2>
      {items.map(i => (
        <div
          key={i.bookID}
          className="flex justify-between items-center p-2 border rounded"
        >
          <span>
            {i.book_name} x{i.quantity}
          </span>
          <button
            onClick={() => remove(i.bookID)}
            className="text-red-500 hover:underline"
          >
            ลบ
          </button>
        </div>
      ))}
      <p className="text-xl">ราคารวม: {total.toFixed(2)} ฿</p>
      <div className="flex space-x-2">
        <input
          className="flex-1 border px-2 py-1 rounded"
          value={coupon}
          onChange={e => setCoupon(e.target.value)}
          placeholder="ใส่โค้ดคูปอง"
        />
        <button
          onClick={applyCoupon}
          className="px-4 py-1 bg-blue-600 text-white rounded"
        >
          ใช้คูปอง
        </button>
      </div>
    </div>
  );
}
