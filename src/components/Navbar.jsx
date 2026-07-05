import React, { useState, useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { SettingsContext } from '../context/SettingsContext';
import { Menu, X, ShoppingBag, Coffee, Compass, Info, Phone, MapPin } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { cartCount } = useContext(CartContext);
  const { settings } = useContext(SettingsContext);
  const location = useLocation();

  React.useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100vh';
    } else {
      document.body.style.overflow = '';
      document.body.style.height = '';
    }
    return () => {
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  const navLinks = [
    { name: 'Home', path: '/', icon: Compass },
    { name: 'Menu', path: '/menu', icon: Coffee },
    { name: 'About', path: '/about', icon: Info },
    { name: 'Contact', path: '/contact', icon: Phone },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="sticky top-0 z-40 w-full border-b border-primary/10 bg-[#FEFFFB]/90 backdrop-blur-md transition-all duration-300">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 font-serif text-xl font-bold tracking-tight text-cafeDark">
              <img src={logoImg} alt="1312 Cafe Logo" className="h-9 w-9 rounded-full object-cover" />
              <span>{settings.cafeName}</span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-primary ${
                    isActive(link.path) ? 'text-primary font-semibold' : 'text-cafeDark/70'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/tracking"
                className="text-xs font-semibold px-3 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-colors"
              >
                Track Order
              </Link>
            </div>

            {/* Cart Icon & Menu Button */}
            <div className="flex items-center gap-4">
              <Link
                to="/cart"
                className="relative p-2 text-cafeDark/80 hover:text-primary transition-colors"
                aria-label="View Cart"
              >
                <ShoppingBag className="h-6 w-6 stroke-[1.8]" />
                {cartCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-background ring-2 ring-background">
                    {cartCount}
                  </span>
                )}
              </Link>

              <button
                onClick={() => setIsOpen(!isOpen)}
                className="p-2 text-cafeDark/80 hover:text-primary transition-colors md:hidden"
                aria-label="Toggle Menu"
              >
                {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-35 bg-cafeDark/40 backdrop-blur-sm md:hidden" onClick={() => setIsOpen(false)} />
      )}

      {/* Mobile Navigation Drawer */}
      <div
        className={`fixed top-0 bottom-0 right-0 z-40 w-72 bg-[#FEFFFB] p-6 shadow-2xl transition-transform duration-300 md:hidden ${
          isOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <Link to="/" className="flex items-center gap-2 font-serif text-lg font-bold text-cafeDark" onClick={() => setIsOpen(false)}>
            <img src={logoImg} alt="1312 Cafe Logo" className="h-7 w-7 rounded-full object-cover" />
            <span>{settings.cafeName}</span>
          </Link>
          <button onClick={() => setIsOpen(false)} className="p-1 rounded-full bg-cafeDark/5 hover:bg-cafeDark/10">
            <X className="h-5 w-5 text-cafeDark" />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          {navLinks.map((link) => {
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center gap-3 p-3 rounded-xl text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-cafeDark/70 hover:bg-cafeDark/5'
                }`}
              >
                <Icon className="h-5 w-5 stroke-[1.8]" />
                {link.name}
              </Link>
            );
          })}
          <Link
            to="/tracking"
            onClick={() => setIsOpen(false)}
            className="flex items-center gap-3 p-3 rounded-xl text-sm font-medium border border-primary/20 bg-primary/5 text-primary hover:bg-primary/10 transition-all mt-4"
          >
            <MapPin className="h-5 w-5 stroke-[1.8]" />
            Track Order
          </Link>
        </div>

        <div className="absolute bottom-8 left-6 right-6 border-t border-cafeDark/10 pt-6">
          <div className="flex items-center gap-2 text-xs text-cafeDark/50">
            <Clock className="h-4 w-4" />
            <span>Open: {settings.businessHours?.days || 'Monday - Sunday'}, {settings.businessHours?.open || '08:00'} - {settings.businessHours?.close || '22:00'}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// Inline fallback for Clock icon
function Clock(props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <circle cx="12" cy="12" r="10" />
      <polyline points="12 6 12 12 16 14" />
    </svg>
  );
}
