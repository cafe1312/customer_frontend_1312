import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Plus, ShoppingBag } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  const handleAdd = (e) => {
    e.preventDefault(); // Stop click propagation to the link wrapper
    if (product.available) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-background border border-primary/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-fade-in">
      {/* Product Image Link */}
      <Link to={`/products/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-cafeDark/5">
        <img
          src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Availability Overlay */}
        {!product.available && (
          <div className="absolute inset-0 flex items-center justify-center bg-cafeDark/40 backdrop-blur-[2px]">
            <span className="rounded-full bg-red-500/95 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-white shadow-sm">
              Sold Out
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <Link to={`/products/${product.id}`} className="text-base font-semibold tracking-tight text-cafeDark hover:text-primary transition-colors">
            {product.name}
          </Link>
          <span className="text-base font-bold text-primary">₹{product.price.toFixed(2)}</span>
        </div>

        <p className="mb-5 line-clamp-2 text-xs text-cafeDark/60 leading-relaxed flex-1">
          {product.description || 'No description available for this delicious menu item.'}
        </p>

        {/* Action Button */}
        <div className="flex items-center justify-between mt-auto">
          <span className="text-[10px] font-semibold text-cafeDark/40 uppercase tracking-widest">
            {product.category?.name || 'Cafe Menu'}
          </span>
          
          <button
            onClick={handleAdd}
            disabled={!product.available}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm transition-all ${
              product.available
                ? 'bg-primary text-background hover:bg-cafeDark hover:text-primary'
                : 'bg-cafeDark/5 text-cafeDark/30 cursor-not-allowed'
            }`}
            title={product.available ? "Add to Cart" : "Sold Out"}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
