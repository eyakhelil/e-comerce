import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShoppingCart, LogOut, ShoppingBag, LayoutDashboard, Users, ClipboardList } from 'lucide-react';

const roleBadge = (isSupplier, isSuperAdmin) => {
  if (isSuperAdmin()) return { label: 'SuperAdmin', cls: 'bg-purple-100 text-purple-700 border border-purple-200' };
  if (isSupplier())   return { label: 'Fournisseur', cls: 'bg-amber-100 text-amber-700 border border-amber-200' };
  return                     { label: 'Client',     cls: 'bg-emerald-100 text-emerald-700 border border-emerald-200' };
};

const Navbar = () => {
  const { auth, logout, isClient, isSupplier, isSuperAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => { logout(); navigate('/'); };
  const badge = roleBadge(isSupplier, isSuperAdmin);

  return (
    <nav className="glass-nav sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">

          {/* Left: Logo + Boutique */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center group">
              <div className="bg-indigo-600 p-2 rounded-xl text-white mr-3 shadow-lg shadow-indigo-600/30 group-hover:scale-110 transition-transform duration-300">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                E-Shop
              </span>
            </Link>
            <Link to="/shop" className="ml-6 text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-semibold transition-colors hover:bg-indigo-50/50">
              Boutique
            </Link>
          </div>

          {/* Right */}
          <div className="flex items-center gap-2">
            {auth.isAuthenticated ? (
              <>
                {/* CLIENT-only links */}
                {isClient() && !isSupplier() && (
                  <>
                    <Link to="/cart" className="text-slate-600 hover:text-indigo-600 p-2.5 rounded-xl transition-all hover:bg-indigo-50/50" title="Mon Panier">
                      <ShoppingCart className="w-5 h-5" />
                    </Link>
                    <Link to="/orders" className="text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors hover:bg-indigo-50/50">
                      <ClipboardList className="w-4 h-4" /> Mes Commandes
                    </Link>
                  </>
                )}

                {/* SUPPLIER + SUPERADMIN links */}
                {isSupplier() && (
                  <Link to="/supplier/dashboard" className="text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors hover:bg-indigo-50/50">
                    <LayoutDashboard className="w-4 h-4 text-indigo-500" /> Dashboard Fournisseur
                  </Link>
                )}
                {isSuperAdmin() && (
                  <Link to="/superadmin/users" className="text-slate-600 hover:text-indigo-600 px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2 transition-colors hover:bg-purple-50/50">
                    <Users className="w-4 h-4 text-purple-500" /> Gestion Utilisateurs
                  </Link>
                )}

                <div className="h-6 w-px bg-slate-200 mx-1" />

                {/* User info */}
                <div className="flex items-center gap-3 pl-1">
                  <div className="flex flex-col items-end">
                    <span className="text-slate-700 font-semibold text-sm leading-tight">{auth.name}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full mt-0.5 ${badge.cls}`}>
                      {badge.label}
                    </span>
                  </div>
                  <button onClick={handleLogout} title="Se déconnecter" className="p-2 text-slate-400 hover:text-rose-500 transition-colors rounded-lg hover:bg-rose-50">
                    <LogOut className="w-5 h-5" />
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="text-slate-600 hover:text-indigo-600 px-5 py-2 rounded-xl text-sm font-semibold transition-colors">
                  Connexion
                </Link>
                <Link to="/register" className="premium-button text-sm">
                  S'inscrire
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
