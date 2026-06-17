import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, LogOut, Settings, ChevronDown } from 'lucide-react';
import AuthModal from './AuthModal';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    setShowDropdown(false);
    navigate('/');
  };

  const navItems = isAuthenticated ? [
    { name: 'Dashboard', path: '/dashboard' },
    { name: 'Analysis', path: '/dashboard/analysis' },
    { name: 'Datasets', path: '/dashboard/datasets' },
  ] : [
    { name: 'Home', path: '/' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-black/40 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to={isAuthenticated ? "/dashboard" : "/"} className="text-xl font-serif font-medium tracking-tight text-white flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all duration-500">
              <div className="w-2 h-2 rounded-full bg-white animate-pulse" />
            </div>
            <span className="opacity-90 group-hover:opacity-100 transition-opacity">Techlytics</span>
          </Link>

          <div className="flex items-center space-x-10">
            {navItems.map((item) => (
              <Link
                key={item.name}
                to={item.path}
                className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50 hover:text-white transition-all duration-300"
              >
                {item.name}
              </Link>
            ))}

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="flex items-center gap-3 p-1.5 pl-4 pr-2 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
                >
                  <span className="text-[13px] font-semibold text-white/80">{user?.name?.split(' ')[0]}</span>
                  <div className="w-8 h-8 rounded-full bg-white/10 overflow-hidden border border-white/20">
                    {user?.avatar_url ? (
                      <img src={user.avatar_url} alt="Profile" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-white/40">
                        <User size={16} />
                      </div>
                    )}
                  </div>
                  <ChevronDown size={14} className={`text-white/40 transition-transform duration-300 ${showDropdown ? 'rotate-180' : ''}`} />
                </button>

                {showDropdown && (
                  <div className="absolute top-full right-0 mt-3 w-56 bg-[#0a0a0a] border border-white/10 rounded-2xl shadow-2xl py-2 overflow-hidden backdrop-blur-xl animate-in fade-in slide-in-from-top-2 duration-300">
                    <div className="px-4 py-3 border-b border-white/5">
                      <div className="text-[13px] font-bold text-white truncate">{user?.name}</div>
                      <div className="text-[11px] text-white/40 truncate">{user?.email}</div>
                    </div>
                    <Link 
                      to="/dashboard/settings" 
                      onClick={() => setShowDropdown(false)}
                      className="flex items-center gap-3 px-4 py-3 text-[13px] text-white/70 hover:text-white hover:bg-white/5 transition-all"
                    >
                      <Settings size={16} className="text-white/40" />
                      Edit Profile
                    </Link>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-[13px] text-red-400 hover:text-red-300 hover:bg-white/5 transition-all"
                    >
                      <LogOut size={16} className="text-red-400/60" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="text-[13px] font-semibold tracking-[0.1em] uppercase text-white/50 hover:text-white transition-all duration-300"
                >
                  Sign Up
                </button>
                <button 
                  onClick={() => setIsAuthOpen(true)}
                  className="btn-primary py-2.5 px-8 text-[13px] tracking-wide cursor-pointer"
                >
                  Login
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
