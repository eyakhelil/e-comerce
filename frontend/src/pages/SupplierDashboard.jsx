import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2 } from 'lucide-react';

const SupplierDashboard = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', stock: '', categoryId: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes, orderRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products/my-products'),
        api.get('/orders/supplier')
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      await api.put(`/orders/${orderId}/status`, { status: newStatus });
      fetchData();
    } catch (error) {
      console.error(error);
      alert("Erreur lors de la mise à jour du statut.");
    }
  };

  const totalRevenue = orders.reduce((acc, o) => acc + (o.total || 0), 0);

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', catForm);
      setCatForm({ name: '', description: '' });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...prodForm,
        price: parseFloat(prodForm.price),
        stock: parseInt(prodForm.stock),
        categoryId: parseInt(prodForm.categoryId)
      });
      setProdForm({ name: '', description: '', price: '', stock: '', categoryId: '' });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Delete product?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (error) { console.error(error); }
    }
  };

  if (loading) return <div>Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-10">
      <header className="flex justify-between items-end pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Tableau de bord fournisseur</h1>
          <p className="text-slate-500 font-medium">Gérez vos catégories et vos produits en toute simplicité.</p>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="premium-card p-6 bg-indigo-600 text-white">
          <div className="text-indigo-100 text-xs font-bold uppercase tracking-wider mb-1">Revenu Total</div>
          <div className="text-3xl font-black">€{totalRevenue.toFixed(2)}</div>
        </div>
        <div className="premium-card p-6 border-indigo-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Commandes</div>
          <div className="text-3xl font-black text-slate-900">{orders.length}</div>
        </div>
        <div className="premium-card p-6 border-indigo-100">
          <div className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Mes Produits</div>
          <div className="text-3xl font-black text-slate-900">{products.length}</div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Categories Section */}
        <div className="premium-card p-8 space-y-6">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Plus className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900">Nouvelle Catégorie</h2>
          </div>
          <form onSubmit={handleCreateCategory} className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom</label>
              <input required type="text" placeholder="ex: Électronique" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="premium-input" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
              <textarea placeholder="Brève description..." value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} className="premium-input h-24 resize-none" />
            </div>
            <button type="submit" className="premium-button w-full">Créer la catégorie</button>
          </form>
          
          <div className="pt-6 border-t border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Catégories existantes</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map(c => (
                <span key={c.id} className="badge-premium">{c.name}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Products Section */}
        <div className="lg:col-span-2 premium-card p-8 space-y-6">
          <div className="flex items-center space-x-3 text-indigo-600">
            <Plus className="w-5 h-5" />
            <h2 className="text-xl font-bold text-slate-900">Ajouter un Produit</h2>
          </div>
          <form onSubmit={handleCreateProduct} className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom du produit</label>
                <input required type="text" placeholder="ex: MacBook Pro M3" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="premium-input" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                <textarea placeholder="Détails du produit..." value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="premium-input h-32 resize-none" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Prix ($)</label>
                  <input required type="number" step="0.01" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} className="premium-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Stock</label>
                  <input required type="number" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} className="premium-input" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Catégorie</label>
                <select required value={prodForm.categoryId} onChange={e => setProdForm({...prodForm, categoryId: e.target.value})} className="premium-input appearance-none">
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="pt-4">
                <button type="submit" className="premium-button w-full py-4 text-lg">Publier le produit</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Product List */}
      <div className="premium-card">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Gérer mes produits</h2>
          <span className="text-sm font-medium text-slate-500">{products.length} produits en ligne</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">Produit</th>
                <th className="px-8 py-4">Prix</th>
                <th className="px-8 py-4">Stock</th>
                <th className="px-8 py-4">Catégorie</th>
                <th className="px-8 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.map(p => (
                <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img
                        src={p.imageUrl || `https://via.placeholder.com/48`}
                        alt={p.name}
                        className="w-12 h-12 rounded-xl object-cover flex-shrink-0 bg-slate-100"
                        onError={e => { e.target.onerror = null; e.target.src = 'https://via.placeholder.com/48'; }}
                      />
                      <div>
                        <div className="font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">{p.name}</div>
                        <div className="text-xs text-slate-400 mt-0.5 line-clamp-1 max-w-xs">{p.description}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5 font-semibold text-slate-700">€{p.price.toFixed(2)}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-2 py-1 rounded-lg text-xs font-bold ${p.stock > 10 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {p.stock} units
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-sm font-medium text-slate-500">{p.category?.name || 'Général'}</span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-300 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Orders List */}
      <div className="premium-card">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Commandes liées à vos produits</h2>
          <span className="text-sm font-medium text-indigo-600 font-bold bg-indigo-50 px-3 py-1 rounded-lg">
            {orders.length} ordres
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-8 py-4">ID Commande</th>
                <th className="px-8 py-4">Statut actuel</th>
                <th className="px-8 py-4">Modifier Statut</th>
                <th className="px-8 py-4">Client</th>
                <th className="px-8 py-4">Total</th>
                <th className="px-8 py-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {orders.map(o => (
                <tr key={o.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="px-8 py-5 font-bold text-slate-900">#{o.id}</td>
                  <td className="px-8 py-5">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold border ${
                      o.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                      o.status === 'SHIPPED' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                      o.status === 'PENDING' ? 'bg-amber-50 text-amber-700 border-amber-100' :
                      'bg-slate-50 text-slate-700 border-slate-100'
                    }`}>
                      {o.status}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <select 
                      className="premium-input py-1 px-2 text-xs w-32 bg-white cursor-pointer"
                      value={o.status}
                      onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                    >
                      <option value="PENDING">En attente</option>
                      <option value="SHIPPED">Expédié</option>
                      <option value="DELIVERED">Livré</option>
                      <option value="CANCELLED">Annulé</option>
                    </select>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-slate-700">{o.user?.name}</div>
                    <div className="text-xs text-slate-400">{o.user?.email}</div>
                  </td>
                  <td className="px-8 py-5 font-extrabold text-indigo-600">€{Number(o.total).toFixed(2)}</td>
                  <td className="px-8 py-5 text-sm text-slate-500">
                    {new Date(o.createdAt).toLocaleDateString()}
                  </td>
                </tr>
              ))}
              {orders.length === 0 && (
                <tr>
                  <td colSpan="5" className="px-8 py-10 text-center text-slate-400 font-medium italic">
                    Aucune commande n'a encore été passée pour vos produits.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SupplierDashboard;
