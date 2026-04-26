import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Package, CheckCircle, XCircle } from 'lucide-react';
import api from '../api/axiosConfig';

const ShopPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const [addingToCart, setAddingToCart] = useState({});
  const [toast, setToast] = useState(null);
  const { auth, isClient, isSupplier } = useAuth();
  const navigate = useNavigate();

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories'),
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Erreur chargement', err);
    }
    setLoading(false);
  };

  const showToast = (msg, type = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 2500);
  };

  const handleAddToCart = async (productId) => {
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/shop' } });
      return;
    }
    if (isSupplier()) return;
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      showToast('Produit ajouté au panier !');
    } catch {
      showToast('Erreur lors de l\'ajout au panier.', 'error');
    }
    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.category?.id === parseInt(selectedCategory))
    : products;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-32">
        <div className="w-10 h-10 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-10">
      {/* Toast */}
      {toast && (
        <div className={`fixed top-24 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-2xl shadow-xl text-sm font-semibold transition-all duration-300 ${toast.type === 'error' ? 'bg-rose-50 text-rose-700 border border-rose-200' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
          {toast.type === 'error' ? <XCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
          {toast.msg}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Découvrez nos produits</h1>
          <p className="text-slate-500 font-medium">Parcourez notre collection exclusive de produits premium.</p>
        </div>
        <div className="relative group min-w-[200px]">
          <select
            className="premium-input appearance-none pr-10 cursor-pointer"
            value={selectedCategory}
            onChange={e => setSelectedCategory(e.target.value)}
          >
            <option value="">Toutes les catégories</option>
            {categories.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <Package className="w-4 h-4" />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="premium-card p-20 text-center">
          <Package className="w-12 h-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-slate-900 mb-1">Aucun produit trouvé</h3>
          <p className="text-slate-500">Essayez une autre catégorie.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => {
            const inStock = product.stock > 0;
            const adminUser = auth.isAuthenticated && isSupplier();
            return (
              <div key={product.id} className="premium-card group flex flex-col">
                <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                  <img
                    src={product.imageUrl || `https://source.unsplash.com/400x400/?${encodeURIComponent(product.name.split(' ')[0])}`}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400'; }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="badge-premium shadow-sm">€{Number(product.price).toFixed(2)}</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    {inStock
                      ? <span className="flex items-center gap-1 text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-1 rounded-lg"><CheckCircle className="w-3 h-3" />En stock</span>
                      : <span className="flex items-center gap-1 text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200 px-2 py-1 rounded-lg"><XCircle className="w-3 h-3" />Rupture</span>
                    }
                  </div>
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
                    {product.category?.name || 'Général'}
                  </p>
                  <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                    {product.name}
                  </h3>
                  <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed flex-1">
                    {product.description || 'Aucune description disponible.'}
                  </p>
                  <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                    <span className="text-sm font-bold text-slate-500">{product.stock} unités</span>
                    <div className="relative group/btn">
                      <button
                        onClick={() => handleAddToCart(product.id)}
                        disabled={addingToCart[product.id] || !inStock || adminUser}
                        className="p-3 bg-slate-900 text-white rounded-xl hover:bg-indigo-600 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 active:scale-90 shadow-md hover:shadow-indigo-500/20"
                      >
                        <ShoppingCart className="w-5 h-5" />
                      </button>
                      {adminUser && (
                        <div className="absolute bottom-full right-0 mb-2 px-3 py-1.5 bg-slate-800 text-white text-xs rounded-lg whitespace-nowrap opacity-0 group-hover/btn:opacity-100 transition-opacity pointer-events-none">
                          Vous êtes admin
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ShopPage;
