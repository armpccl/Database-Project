import React, { useEffect, useState } from 'react';
import api from '../../api/axios';

export default function ShippingMgmtPage() {
  const [shipping, setShipping] = useState([]);
  useEffect(() => api.get('/admin/shipping').then(r => setShipping(r.data)), []);

  const update = (tracking, status) => api.put(`/admin/shipping/${tracking}`, { shipping_status: status }).then(() => {
    setShipping(s => s.map(x => x.tracking_number===tracking?{...x,shipping_status:status}:x));
  });
  const remove = tracking => api.delete(`/admin/shipping/${tracking}`).then(() => {
    setShipping(s => s.filter(x => x.tracking_number!==tracking));
  });

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Shipping & Delivery Management</h1>
      <table className="w-full table-auto">
        <thead><tr><th>Tracking#</th><th>Status</th><th>OrderID</th><th>Actions</th></tr></thead>
        <tbody>
          {shipping.map(s => (
            <tr key={s.tracking_number} className="hover:bg-gray-100">
              <td>{s.tracking_number}</td>
              <td>{s.shipping_status}</td>
              <td>{s.orderID}</td>
              <td className="space-x-2">
                <button onClick={() => update(s.tracking_number, 'Delivered')} className="text-blue-500">
                  Mark Delivered
                </button>
                <button onClick={() => remove(s.tracking_number)} className="text-red-500">
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}