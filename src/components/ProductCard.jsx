import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { Plus } from 'lucide-react';

export default function ProductCard({ product }) {
  const { addToCart } = useContext(CartContext);

  // Calculate if category is currently available
  const categoryAvailable = !product.category || 
    (!product.category.availableFrom || !product.category.availableTo) ||
    (() => {
      const now = new Date();
      const currentVal = now.getHours() * 60 + now.getMinutes();
      const parseMin = (t) => {
        if (!t) return 0;
        const p = t.split(':');
        return p.length >= 2 ? parseInt(p[0]) * 60 + parseInt(p[1]) : 0;
      };
      const fromVal = parseMin(product.category.availableFrom);
      const toVal = parseMin(product.category.availableTo);
      return fromVal <= toVal 
        ? (currentVal >= fromVal && currentVal <= toVal)
        : (currentVal >= fromVal || currentVal <= toVal);
    })();

  const isProductBuyable = product.available && categoryAvailable;

  const handleAdd = (e) => {
    e.preventDefault(); // Stop click propagation to the link wrapper
    if (isProductBuyable) {
      addToCart(product, 1);
    }
  };

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-3xl bg-background border border-primary/5 shadow-sm hover:shadow-xl hover:border-primary/20 transition-all duration-300 animate-fade-in">
      {/* Product Image Link */}
      <Link to={`/product/${product.id}`} className="relative block aspect-[4/3] overflow-hidden bg-cafeDark/5">
        {/* Dietary Tag on Image */}
        <div className="absolute top-3 left-3 z-10 flex items-center gap-1 rounded-full bg-white/95 px-2.5 py-0.5 shadow-sm border border-primary/5">
          <div className={`w-2.5 h-2.5 border flex items-center justify-center rounded-[2px] shrink-0 ${product.isVeg ? 'border-green-600' : 'border-red-650'}`}>
            <div className={`w-1 h-1 rounded-full ${product.isVeg ? 'bg-green-600' : 'bg-red-600'}`}></div>
          </div>
          <span className={`text-[8px] font-bold uppercase tracking-wider ${product.isVeg ? 'text-green-700' : 'text-red-750'}`}>
            {product.isVeg ? 'Veg' : 'Non-Veg'}
          </span>
        </div>

        <img
          src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60'}
          alt={product.name}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {/* Availability Overlay */}
        {!isProductBuyable && (
          <div className="absolute inset-0 flex items-center justify-center bg-cafeDark/40 backdrop-blur-[2px] z-20">
            <span className="rounded-full bg-red-500/95 px-3.5 py-1.5 text-[9px] font-black tracking-wider uppercase text-white shadow-sm text-center max-w-[85%]">
              {!product.available 
                ? 'Sold Out' 
                : `Closed (Open: ${product.category?.availableFrom} - ${product.category?.availableTo})`}
            </span>
          </div>
        )}
      </Link>

      {/* Product Info */}
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-start justify-between">
          <Link to={`/product/${product.id}`} className="text-base font-semibold tracking-tight text-cafeDark hover:text-primary transition-colors">
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
            disabled={!isProductBuyable}
            className={`flex h-10 w-10 items-center justify-center rounded-2xl shadow-sm transition-all ${
              isProductBuyable
                ? 'bg-primary text-background hover:bg-cafeDark hover:text-primary'
                : 'bg-cafeDark/5 text-cafeDark/30 cursor-not-allowed'
            }`}
            title={isProductBuyable ? "Add to Cart" : !product.available ? "Sold Out" : "Unavailable (Closed)"}
          >
            <Plus className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
