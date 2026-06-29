import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Menu from './pages/Menu';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Tracking from './pages/Tracking';
import About from './pages/About';
import Contact from './pages/Contact';

export default function App() {
  return (
    <CartProvider>
      <Router>
        <div className="flex flex-col min-h-screen bg-[#F8F9F6] text-cafeDark selection:bg-primary/30">
          <Navbar />
          <main className="flex-grow">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/menu" element={<Menu />} />
              <Route path="/product/:id" element={<ProductDetails />} />
              <Route path="/cart" element={<Cart />} />
              <Route path="/tracking" element={<Tracking />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </CartProvider>
  );
}
