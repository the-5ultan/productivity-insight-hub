import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Analytics', path: '/dashboard/analysis' },
    { name: 'Research', path: '/dashboard/reports' },
    { name: 'Visualizations', path: '/dashboard/visuals' },
    { name: 'Dashboard', path: '/dashboard' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'bg-black/60 backdrop-blur-xl border-b border-white/5 py-4' : 'bg-transparent py-8'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="text-2xl font-serif font-medium tracking-tight text-white flex items-center gap-2">
          <div className="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center">
            <div className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
          </div>
          Techlytics
        </Link>

        <div className="hidden md:flex items-center space-x-10">
          {navItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className="text-[13px] font-medium tracking-wide text-secondary-accent hover:text-white transition-colors duration-300"
            >
              {item.name}
            </Link>
          ))}
          <Link to="/register" className="btn-primary py-2.5 px-7 text-[13px]">
            Start Analysis
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
