import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { PackageOpen } from 'lucide-react';

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await api.get('/orders/my');
      setOrders(res.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  if (loading) return <div className="text-center py-20">Loading orders...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <h1 className="text-3xl font-extrabold text-gray-900 flex items-center">
        <PackageOpen className="w-8 h-8 mr-3 text-indigo-600" /> My Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You have no past orders.</p>
      ) : (
        orders.map(order => (
          <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border">
            <div className="flex justify-between items-center border-b pb-4 mb-4">
              <div>
                <span className="text-sm text-gray-500 block">Order #{order.id}</span>
                <span className="text-sm font-medium text-gray-900">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="text-right">
                <span className="text-sm font-bold text-indigo-600 uppercase bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
                  {order.status}
                </span>
                <div className="text-lg font-extrabold text-gray-900 mt-1">€{Number(order.total).toFixed(2)}</div>
              </div>
            </div>
            <div className="space-y-3">
              {order.orderLines.map(line => (
                <div key={line.id} className="flex justify-between text-sm items-center">
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-gray-700">{line.quantity}x</span>
                    <span className="text-gray-900">{line.product?.name || 'Unknown Product'}</span>
                  </div>
                  <span className="text-gray-600">€{Number(line.unitPrice).toFixed(2)} / unité</span>
                </div>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default OrderHistory;
