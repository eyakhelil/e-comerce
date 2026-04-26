import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, Package } from 'lucide-react';
import api from '../api/axiosConfig';

const ProductCatalog = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [loading, setLoading] = useState(true);
  const { auth, isClient, isSupplier, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const [addingToCart, setAddingToCart] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.get('/products'),
        api.get('/categories')
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (error) {
      console.error('Error fetching data', error);
    }
    setLoading(false);
  };

  const handleAddToCart = async (productId) => {
    if (!auth.isAuthenticated) {
      navigate('/login', { state: { redirectTo: '/cart' } });
      return;
    }
    if (isSupplier() || isSuperAdmin()) {
      return;
    }
    setAddingToCart(prev => ({ ...prev, [productId]: true }));
    try {
      await api.post('/cart/items', { productId, quantity: 1 });
      navigate('/cart');
    } catch (error) {
      console.error('Error adding to cart', error);
      alert('Failed to add to cart');
    }
    setAddingToCart(prev => ({ ...prev, [productId]: false }));
  };

  const filteredProducts = selectedCategory
    ? products.filter(p => p.categories?.some(c => c.id === parseInt(selectedCategory)))
    : products;

  if (loading) return <div className="text-center py-20">Loading products...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10">
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
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400 group-hover:text-indigo-500 transition-colors">
            <Package className="w-5 h-5" />
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="premium-card p-20 text-center">
          <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 border border-slate-200">
            <Package className="w-8 h-8 text-slate-400" />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-1">Aucun produit trouvé</h3>
          <p className="text-slate-500">Essayez de changer de catégorie ou revenez plus tard.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map(product => (
            <div key={product.id} className="premium-card group relative flex flex-col h-full">
              <div className="aspect-[4/5] bg-slate-100 relative overflow-hidden">
                <img 
                  src={product.imageUrl || `https://source.unsplash.com/400x400/?${encodeURIComponent(product.name.split(' ')[0])}`}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/400'; }}
                />
                <div className="absolute top-4 right-4 flex flex-col gap-2 items-end">
                  <span className="badge-premium shadow-sm backdrop-blur-md">
                    ${product.price.toFixed(2)}
                  </span>
                  {product.stock > 0 ? (
                    <span className="bg-emerald-100/90 text-emerald-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md border border-emerald-200 uppercase">
                      En stock
                    </span>
                  ) : (
                    <span className="bg-rose-100/90 text-rose-800 text-[10px] font-bold px-2 py-1 rounded-full shadow-sm backdrop-blur-md border border-rose-200 uppercase">
                      Rupture de stock
                    </span>
                  )}
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-bold uppercase tracking-wider text-indigo-500 mb-2">
                  {product.categories?.length ? product.categories.map(c => c.name).join(', ') : 'Général'}
                </p>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {product.name}
                </h3>
                <p className="text-slate-500 text-sm mb-6 line-clamp-2 leading-relaxed">
                  {product.description || "Aucune description disponible pour ce produit premium."}
                </p>
                <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                  <div className="flex flex-col">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Stock Restant</span>
                    <span className={`text-sm font-bold ${product.stock > 0 ? 'text-slate-700' : 'text-rose-500'}`}>
                      {product.stock}
                    </span>
                  </div>
                  
                  <div className="relative group/btn">
                    <button 
                      onClick={() => handleAddToCart(product.id)}
                      disabled={addingToCart[product.id] || product.stock <= 0 || isSupplier() || isSuperAdmin()}
                      className={`p-3 text-white rounded-xl transition-all duration-300 shadow-md ${
                        (isSupplier() || isSuperAdmin() || product.stock <= 0) 
                          ? 'bg-slate-300 cursor-not-allowed opacity-50' 
                          : 'bg-slate-900 hover:bg-indigo-600 hover:shadow-indigo-500/20 active:scale-90'
                      }`}
                    >
                      <ShoppingCart className="w-5 h-5" />
                    </button>
                    {(isSupplier() || isSuperAdmin()) && (
                      <div className="absolute w-max max-w-[150px] bottom-full right-0 mb-2 invisible group-hover/btn:visible opacity-0 group-hover/btn:opacity-100 transition-all bg-slate-800 text-white text-xs py-1 px-2 rounded-lg z-10 shadow-lg text-center">
                        Compte Gestionnaire
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductCatalog;
