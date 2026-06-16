import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import AuthModal from './AuthModal';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [isAuthOpen, setIsAuthOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-black/40 backdrop-blur-2xl border-b border-white/5 py-3' : 'bg-transparent py-8'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <Link to="/" className="text-xl font-serif font-medium tracking-tight text-white flex items-center gap-2.5 group">
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
            <button 
              onClick={() => setIsAuthOpen(true)}
              className="btn-primary py-2.5 px-8 text-[13px] tracking-wide cursor-pointer"
            >
              Login / Sign Up
            </button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={isAuthOpen} onClose={() => setIsAuthOpen(false)} />
    </>
  );
};

export default Navbar;
