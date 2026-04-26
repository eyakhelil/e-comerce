import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Trash2, ShoppingBag, ArrowLeft, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const CartPage = () => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [checkingOut, setCheckingOut] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(null);
  const { auth } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchCart(); }, []);

  const fetchCart = async () => {
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const handleUpdateQuantity = async (itemId, currentQty, delta) => {
    const newQty = currentQty + delta;
    if (newQty < 1) return;
    try {
      await api.put(`/cart/items/${itemId}?quantity=${newQty}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const handleRemove = async (itemId) => {
    try {
      await api.delete(`/cart/items/${itemId}`);
      fetchCart();
    } catch (err) { console.error(err); }
  };

  const handleCheckout = async () => {
    if (!cart?.items?.length) return;
    setCheckingOut(true);
    try {
      await api.post('/orders/checkout');
      setOrderSuccess(auth?.email || 'votre email');
      setCart(prev => ({ ...prev, items: [] }));
    } catch (err) {
      console.error("Checkout error:", err);
      const errorMessage = err.response?.data?.message || err.response?.data?.error || err.message || 'Erreur lors de la commande.';
      alert(`Erreur: ${errorMessage}`);
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center py-32">
      <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
    </div>
  );

  const items = cart?.items || [];
  const total = items.reduce((sum, item) => sum + (Number(item.product.price) * item.quantity), 0);

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-4xl font-extrabold text-slate-900 mb-8 flex items-center gap-3">
        <ShoppingBag className="w-9 h-9 text-indigo-600" /> Mon Panier
      </h1>

      {/* Order Success Banner */}
      {orderSuccess && (
        <div className="mb-8 rounded-2xl border border-emerald-200 bg-emerald-50 p-6 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
            <CheckCircle className="w-6 h-6 text-emerald-600" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-bold text-emerald-800 mb-1">Commande confirmée !</h3>
            <p className="text-sm text-emerald-700">
              Un email de confirmation a été envoyé à <span className="font-bold">{orderSuccess}</span>.
              Vérifiez votre boîte de réception.
            </p>
          </div>
          <Link to="/orders" className="flex-shrink-0 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-sm px-5 py-2.5 rounded-xl transition-colors">
            Voir mes commandes →
          </Link>
        </div>
      )}

      {items.length === 0 ? (
        <div className="premium-card p-16 text-center">
          <ShoppingBag className="w-14 h-14 text-slate-300 mx-auto mb-5" />
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Votre panier est vide</h3>
          <p className="text-slate-500 mb-8">Ajoutez des produits pour commencer vos achats.</p>
          <Link to="/shop" className="premium-button inline-flex items-center gap-2">
            <ArrowLeft className="w-4 h-4" /> Continuer les achats
          </Link>
        </div>
      ) : (
        <div className="premium-card">
          <div className="divide-y divide-slate-100">
            {items.map(item => (
              <div key={item.id} className="flex items-center gap-6 p-6 hover:bg-slate-50/50 transition-colors">
                <div className="w-14 h-14 bg-slate-100 rounded-xl flex items-center justify-center flex-shrink-0">
                  <ShoppingBag className="w-6 h-6 text-slate-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-slate-900 truncate">{item.product.name}</h3>
                  <p className="text-sm text-slate-500">€{Number(item.product.price).toFixed(2)} / unité</p>
                </div>
                <div className="flex items-center border border-slate-200 rounded-xl overflow-hidden">
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity, -1)} className="px-3 py-2 hover:bg-slate-100 text-slate-700 font-bold transition-colors">−</button>
                  <span className="px-4 py-2 border-x border-slate-200 font-semibold text-slate-900 min-w-[2.5rem] text-center">{item.quantity}</span>
                  <button onClick={() => handleUpdateQuantity(item.id, item.quantity, 1)} className="px-3 py-2 hover:bg-slate-100 text-slate-700 font-bold transition-colors">+</button>
                </div>
                <div className="text-right min-w-[5rem]">
                  <span className="font-bold text-slate-900">€{(Number(item.product.price) * item.quantity).toFixed(2)}</span>
                </div>
                <button onClick={() => handleRemove(item.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-all">
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>

          <div className="p-6 bg-slate-50/50 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
            <Link to="/shop" className="text-slate-600 hover:text-indigo-600 font-semibold text-sm flex items-center gap-2 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Continuer les achats
            </Link>
            <div className="flex items-center gap-6">
              <div className="text-right">
                <p className="text-xs text-slate-400 uppercase font-bold">Total</p>
                <p className="text-3xl font-extrabold text-indigo-600">€{total.toFixed(2)}</p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={checkingOut}
                className="premium-button py-3 px-8 text-base disabled:opacity-60"
              >
                {checkingOut ? 'Traitement...' : 'Passer la commande'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
