import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { UserPlus } from 'lucide-react';

const RegisterPage = () => {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/register', form);
      login(response.data);
      navigate('/shop', { replace: true });
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l'inscription.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-16 pb-20">
      <div className="premium-card p-10 max-w-md w-full shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-10">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            <UserPlus className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Créer un compte</h2>
          <p className="text-slate-500 font-medium">Rejoignez notre communauté.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Nom complet</label>
            <input
              type="text"
              name="name"
              className="premium-input"
              placeholder="Jean Dupont"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Adresse Email</label>
            <input
              type="email"
              name="email"
              className="premium-input"
              placeholder="votre@email.com"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mot de passe</label>
            <input
              type="password"
              name="password"
              className="premium-input"
              placeholder="Minimum 6 caractères"
              value={form.password}
              onChange={handleChange}
              minLength={6}
              required
            />
          </div>
          <div className="pt-2">
            <p className="text-xs text-slate-400 mb-4 text-center">
              Votre compte sera créé avec le rôle <span className="font-bold text-emerald-600">CLIENT</span>.
            </p>
            <button type="submit" disabled={loading} className="premium-button w-full py-4 text-lg disabled:opacity-60">
              {loading ? 'Inscription...' : "S'inscrire"}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Déjà un compte ?{' '}
          <Link to="/login" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
