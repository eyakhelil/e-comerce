import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Plus, Trash2, Package, Tags, Truck, ShoppingBag } from 'lucide-react';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('products');
  const [loading, setLoading] = useState(true);

  // Data
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [orders, setOrders] = useState([]);

  // Forms
  const [catForm, setCatForm] = useState({ name: '', description: '' });
  const [supForm, setSupForm] = useState({ name: '', contact: '' });
  const [prodForm, setProdForm] = useState({ name: '', description: '', price: '', stock: '', categoryIds: [], supplierId: '', imageUrl: '' });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [catRes, prodRes, supRes, orderRes] = await Promise.all([
        api.get('/categories'),
        api.get('/products'),
        api.get('/suppliers'),
        api.get('/orders/all')
      ]);
      setCategories(catRes.data);
      setProducts(prodRes.data);
      setSuppliers(supRes.data);
      setOrders(orderRes.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await api.post('/categories', catForm);
      setCatForm({ name: '', description: '' });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Supprimer cette catégorie ?')) {
      try {
        await api.delete(`/categories/${id}`);
        fetchData();
      } catch (error) { console.error(error); }
    }
  };

  const handleCreateSupplier = async (e) => {
    e.preventDefault();
    try {
      await api.post('/suppliers', supForm);
      setSupForm({ name: '', contact: '' });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteSupplier = async (id) => {
    if (window.confirm('Supprimer ce fournisseur ?')) {
      try {
        await api.delete(`/suppliers/${id}`);
        fetchData();
      } catch (error) { console.error(error); }
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await api.post('/products', {
        ...prodForm,
        price: parseFloat(prodForm.price),
        stock: parseInt(prodForm.stock),
        categoryIds: prodForm.categoryIds.map(id => parseInt(id)),
        supplierId: prodForm.supplierId ? parseInt(prodForm.supplierId) : null,
        imageUrl: prodForm.imageUrl
      });
      setProdForm({ name: '', description: '', price: '', stock: '', categoryIds: [], supplierId: '', imageUrl: '' });
      fetchData();
    } catch (error) { console.error(error); }
  };

  const handleDeleteProduct = async (id) => {
    if (window.confirm('Supprimer ce produit ?')) {
      try {
        await api.delete(`/products/${id}`);
        fetchData();
      } catch (error) { console.error(error); }
    }
  };

  const handleUpdateOrderStatus = async (id, status) => {
    try {
      await api.put(`/orders/${id}/status`, { status });
      fetchData();
    } catch (error) { console.error(error); }
  };

  if (loading) return <div className="text-center py-20">Loading dashboard...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-10">
      <header className="flex justify-between items-end pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2">Tableau de bord Admin</h1>
          <p className="text-slate-500 font-medium">Gérez le catalogue et les commandes de la boutique.</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex space-x-4 border-b border-slate-200">
        {[
          { id: 'products', name: 'Produits', icon: Package },
          { id: 'categories', name: 'Catégories', icon: Tags },
          { id: 'suppliers', name: 'Fournisseurs', icon: Truck },
          { id: 'orders', name: 'Commandes', icon: ShoppingBag }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center space-x-2 py-4 px-6 border-b-2 font-semibold transition-colors ${
              activeTab === tab.id 
                ? 'border-indigo-600 text-indigo-600' 
                : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
            }`}
          >
            <tab.icon className="w-5 h-5" />
            <span>{tab.name}</span>
          </button>
        ))}
      </div>

      <div className="pt-6">
        {/* ================= PRODUCTS TAB ================= */}
        {activeTab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Create Product Form */}
            <div className="lg:col-span-1 premium-card p-8 space-y-6">
              <div className="flex items-center space-x-3 text-indigo-600">
                <Plus className="w-5 h-5" />
                <h2 className="text-xl font-bold text-slate-900">Nouveau Produit</h2>
              </div>
              <form onSubmit={handleCreateProduct} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom</label>
                  <input required type="text" placeholder="Nom du produit" value={prodForm.name} onChange={e => setProdForm({...prodForm, name: e.target.value})} className="premium-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                  <textarea placeholder="Description..." value={prodForm.description} onChange={e => setProdForm({...prodForm, description: e.target.value})} className="premium-input h-20 resize-none" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Prix (€)</label>
                    <input required type="number" step="0.01" value={prodForm.price} onChange={e => setProdForm({...prodForm, price: e.target.value})} className="premium-input" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase ml-1">Stock</label>
                    <input required type="number" value={prodForm.stock} onChange={e => setProdForm({...prodForm, stock: e.target.value})} className="premium-input" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Catégories (Maintenir Ctrl pour sélectionner plusieurs)</label>
                  <select multiple value={prodForm.categoryIds} onChange={e => {
                    const selected = Array.from(e.target.selectedOptions, option => option.value);
                    setProdForm({...prodForm, categoryIds: selected});
                  }} className="premium-input cursor-pointer min-h-[100px]">
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">URL Image (Optionnel)</label>
                  <input type="text" placeholder="https://..." value={prodForm.imageUrl} onChange={e => setProdForm({...prodForm, imageUrl: e.target.value})} className="premium-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Fournisseur</label>
                  <select value={prodForm.supplierId} onChange={e => setProdForm({...prodForm, supplierId: e.target.value})} className="premium-input appearance-none cursor-pointer">
                    <option value="">Sélectionner</option>
                    {suppliers.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                </div>
                <button type="submit" className="premium-button w-full py-4 mt-2">Publier le produit</button>
              </form>
            </div>

            {/* List Products */}
            <div className="lg:col-span-2 premium-card">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Inventaire</h2>
                <span className="text-sm font-medium text-slate-500">{products.length} produits</span>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                      <th className="px-6 py-4">Produit</th>
                      <th className="px-6 py-4">Prix</th>
                      <th className="px-6 py-4">Stock</th>
                      <th className="px-6 py-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map(p => (
                      <tr key={p.id} className="group hover:bg-slate-50/50 transition-colors">
                        <td className="px-6 py-4">
                          <div className="font-bold text-slate-900">{p.name}</div>
                          <div className="text-xs text-slate-400 mt-0.5">{p.categories?.length ? p.categories.map(c => c.name).join(', ') : 'Général'}</div>
                        </td>
                        <td className="px-6 py-4 font-semibold text-slate-700">€{p.price.toFixed(2)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 rounded-lg text-xs font-bold ${p.stock > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                            {p.stock}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteProduct(p.id)} className="p-2 text-slate-300 hover:text-rose-500 transition-all rounded-lg hover:bg-rose-50">
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ================= CATEGORIES TAB ================= */}
        {activeTab === 'categories' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 premium-card p-8 space-y-6 h-max">
              <div className="flex items-center space-x-3 text-indigo-600">
                <Plus className="w-5 h-5" />
                <h2 className="text-xl font-bold text-slate-900">Nouvelle Catégorie</h2>
              </div>
              <form onSubmit={handleCreateCategory} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom</label>
                  <input required type="text" value={catForm.name} onChange={e => setCatForm({...catForm, name: e.target.value})} className="premium-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Description</label>
                  <textarea value={catForm.description} onChange={e => setCatForm({...catForm, description: e.target.value})} className="premium-input h-24 resize-none" />
                </div>
                <button type="submit" className="premium-button w-full">Créer</button>
              </form>
            </div>
            <div className="lg:col-span-2 premium-card">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Catégories</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {categories.map(c => (
                    <div key={c.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-bold text-slate-900">{c.name}</div>
                        <div className="text-sm text-slate-500">{c.description}</div>
                      </div>
                      <button onClick={() => handleDeleteCategory(c.id)} className="p-2 text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SUPPLIERS TAB ================= */}
        {activeTab === 'suppliers' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 premium-card p-8 space-y-6 h-max">
              <div className="flex items-center space-x-3 text-indigo-600">
                <Plus className="w-5 h-5" />
                <h2 className="text-xl font-bold text-slate-900">Nouveau Fournisseur</h2>
              </div>
              <form onSubmit={handleCreateSupplier} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom</label>
                  <input required type="text" value={supForm.name} onChange={e => setSupForm({...supForm, name: e.target.value})} className="premium-input" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Contact</label>
                  <input type="text" value={supForm.contact} onChange={e => setSupForm({...supForm, contact: e.target.value})} className="premium-input" placeholder="Email ou téléphone" />
                </div>
                <button type="submit" className="premium-button w-full">Créer</button>
              </form>
            </div>
            <div className="lg:col-span-2 premium-card">
              <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                <h2 className="text-2xl font-bold text-slate-900">Fournisseurs</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {suppliers.map(s => (
                    <div key={s.id} className="p-4 border border-slate-100 rounded-xl flex justify-between items-center hover:shadow-md transition-shadow">
                      <div>
                        <div className="font-bold text-slate-900">{s.name}</div>
                        <div className="text-sm text-slate-500">{s.contact}</div>
                      </div>
                      <button onClick={() => handleDeleteSupplier(s.id)} className="p-2 text-slate-400 hover:text-rose-500">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= ORDERS TAB ================= */}
        {activeTab === 'orders' && (
          <div className="premium-card">
            <div className="p-8 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-2xl font-bold text-slate-900">Toutes les Commandes</h2>
              <span className="text-sm font-medium text-slate-500">{orders.length} commandes</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                    <th className="px-6 py-4">ID</th>
                    <th className="px-6 py-4">Client</th>
                    <th className="px-6 py-4">Total</th>
                    <th className="px-6 py-4">Statut</th>
                    <th className="px-6 py-4">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {orders.map(o => (
                    <tr key={o.id} className="group hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-slate-900">#{o.id}</td>
                      <td className="px-6 py-4 text-slate-600">{o.user?.name || `Utilisateur ${o.user?.id || 'Inconnu'}`}</td>
                      <td className="px-6 py-4 font-semibold text-indigo-600">€{o.total?.toFixed(2)}</td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                          o.status === 'PENDING' ? 'bg-amber-100 text-amber-700 border-amber-200' :
                          o.status === 'SHIPPED' ? 'bg-blue-100 text-blue-700 border-blue-200' :
                          o.status === 'DELIVERED' ? 'bg-emerald-100 text-emerald-700 border-emerald-200' :
                          'bg-slate-100 text-slate-700 border-slate-200'
                        } border`}>
                          {o.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select 
                          className="premium-input py-1 px-2 text-sm w-32 cursor-pointer"
                          value={o.status}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                        >
                          <option value="PENDING">PENDING</option>
                          <option value="SHIPPED">SHIPPED</option>
                          <option value="DELIVERED">DELIVERED</option>
                          <option value="CANCELLED">CANCELLED</option>
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
