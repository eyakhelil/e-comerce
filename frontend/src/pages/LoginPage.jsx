import React, { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axiosConfig';
import { Lock } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isSupplier, isSuperAdmin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { email, password });
      login(response.data);

      const roles = response.data.roles || [];
      if (redirectTo) {
        navigate(redirectTo, { replace: true });
      } else if (roles.includes('SUPERADMIN')) {
        navigate('/superadmin/users', { replace: true });
      } else if (roles.includes('SUPPLIER')) {
        navigate('/supplier/dashboard', { replace: true });
      } else {
        navigate('/shop', { replace: true });
      }
    } catch {
      setError('Identifiants incorrects. Veuillez réessayer.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center pt-16 pb-20">
      <div className="premium-card p-10 max-w-md w-full shadow-2xl shadow-indigo-500/10">
        <div className="text-center mb-10">
          <div className="bg-indigo-600 w-12 h-12 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg shadow-indigo-600/30">
            <Lock className="text-white w-6 h-6" />
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 mb-2">Bon retour</h2>
          <p className="text-slate-500 font-medium">Connectez-vous à votre compte.</p>
        </div>

        {error && (
          <div className="bg-rose-50 border border-rose-100 text-rose-600 p-4 rounded-xl mb-6 text-sm font-semibold flex items-center gap-2">
            <span>⚠️</span> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Adresse Email</label>
            <input
              type="email"
              className="premium-input"
              placeholder="votre@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-400 uppercase ml-1">Mot de passe</label>
            <input
              type="password"
              className="premium-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="pt-2">
            <button type="submit" disabled={loading} className="premium-button w-full py-4 text-lg disabled:opacity-60">
              {loading ? 'Connexion...' : 'Se connecter'}
            </button>
          </div>
        </form>

        <p className="mt-8 text-center text-sm text-slate-500">
          Pas de compte ?{' '}
          <Link to="/register" className="text-indigo-600 font-bold hover:text-indigo-700 transition-colors">
            S'inscrire
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
