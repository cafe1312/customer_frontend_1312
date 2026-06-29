import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import logoImg from '../assets/logo.png';

function InstagramIcon(props) {
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
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function FacebookIcon(props) {
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
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="bg-cafeDark text-background border-t border-primary/10">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2.5 font-serif text-2xl font-bold tracking-tight">
              <img src={logoImg} alt="1312 Cafe Logo" className="h-9 w-9 rounded-full object-cover" />
              <span>1312 <span className="text-primary">Cafe</span></span>
            </Link>
            <p className="text-background/60 text-sm max-w-sm">
              Artisanal roasts, crafted teas, and premium bites served in a tranquil modern oasis. Elevate your everyday coffee experience.
            </p>
            <div className="flex gap-4 pt-2">
              <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-background/5 hover:bg-primary hover:text-cafeDark transition-all text-background/80">
                <InstagramIcon className="h-4 w-4" />
              </a>
              <a href="https://facebook.com" target="_blank" rel="noreferrer" className="p-2 rounded-full bg-background/5 hover:bg-primary hover:text-cafeDark transition-all text-background/80">
                <FacebookIcon className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-primary font-semibold text-sm tracking-wider uppercase mb-4">Explore</h3>
            <ul className="space-y-2 text-sm text-background/70">
              <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact</Link></li>
              <li><Link to="/tracking" className="hover:text-primary transition-colors">Track Order</Link></li>
            </ul>
          </div>

          {/* Contacts & Hours */}
          <div>
            <h3 className="text-primary font-semibold text-sm tracking-wider uppercase mb-4">Vibe With Us</h3>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-primary shrink-0" />
                <span>+1 234 567 8900</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                <span>1312 Gourmet St, Culinary City</span>
              </li>
              <li className="border-t border-background/10 pt-3 mt-3 text-xs text-background/50">
                <p className="font-semibold text-background/80 mb-1">Hours:</p>
                <p>Monday - Sunday: 8:00 AM - 10:00 PM</p>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-background/10 mt-12 pt-6 flex flex-col md:flex-row items-center justify-between text-xs text-background/50 gap-4">
          <p>© {new Date().getFullYear()} 1312 Cafe. All rights reserved.</p>
          <div className="flex gap-4">
            <a href="#privacy" className="hover:text-primary">Privacy Policy</a>
            <a href="#terms" className="hover:text-primary">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
