import React, { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import { Trash2, Shield, User as UserIcon } from 'lucide-react';

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await api.get('/admin/users');
      setUsers(response.data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  const handleRoleChange = async (userId, newRoleName) => {
    const roleId = newRoleName === 'CLIENT' ? 1 : newRoleName === 'SUPPLIER' ? 2 : 3;
    try {
      await api.put(`/admin/users/${userId}/role`, { roleId });
      fetchUsers();
    } catch (error) {
      console.error(error);
      alert('Erreur lors du changement de rôle');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Voulez-vous vraiment supprimer cet utilisateur ? Cette action est irréversible.')) {
      try {
        await api.delete(`/admin/users/${userId}`);
        fetchUsers();
      } catch (error) {
        console.error(error);
        alert('Erreur lors de la suppression');
      }
    }
  };

  if (loading) return <div className="text-center py-20">Chargement...</div>;

  return (
    <div className="max-w-7xl mx-auto py-10 space-y-10">
      <header className="flex justify-between items-end pb-8 border-b border-slate-200">
        <div>
          <h1 className="text-4xl font-extrabold text-slate-900 mb-2 flex items-center gap-3">
            <Shield className="text-purple-600 w-10 h-10" /> Gestion des Utilisateurs
          </h1>
          <p className="text-slate-500 font-medium">Contrôle complet des accès et des rôles. Zone réservée aux SuperAdmins.</p>
        </div>
      </header>

      <div className="premium-card">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center">
          <h2 className="text-2xl font-bold text-slate-900">Utilisateurs enregistrés</h2>
          <span className="text-sm font-medium text-slate-500">{users.length} comptes</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 text-slate-400 text-[11px] font-bold uppercase tracking-widest border-b border-slate-100">
                <th className="px-6 py-4">Utilisateur</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Date de Création</th>
                <th className="px-6 py-4">Rôle</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {users.map(u => (
                <tr key={u.id} className="group hover:bg-slate-50/50 transition-colors">
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center font-bold relative overflow-hidden">
                        <UserIcon className="w-5 h-5" />
                      </div>
                      <span className="font-bold text-slate-900">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-5 text-slate-600 font-medium">{u.email}</td>
                  <td className="px-6 py-5 text-slate-500 text-sm">
                    {u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-5">
                    {/* Role Selector dropdown */}
                    <select
                      className="premium-input py-1.5 px-3 text-sm min-w-[140px] font-bold cursor-pointer bg-white"
                      value={u.roles && u.roles.length > 0 ? u.roles[0] : 'CLIENT'}
                      onChange={(e) => handleRoleChange(u.id, e.target.value)}
                    >
                      <option value="CLIENT">CLIENT</option>
                      <option value="SUPPLIER">FOURNISSEUR</option>
                      <option value="SUPERADMIN">SUPERADMIN</option>
                    </select>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button 
                      onClick={() => handleDeleteUser(u.id)} 
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Supprimer l'utilisateur"
                    >
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
  );
};

export default UserManagementPage;
