import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import Spinner from '../components/Spinner';
import { CartContext } from '../context/CartContext';
import { ArrowLeft, Plus, Minus, ShoppingBag } from 'lucide-react';

const SEED_PRODUCTS = [
  { id: 1, name: 'Espresso Single', price: 2.50, description: 'Rich, bold, and intense single shot of espresso.', available: true, category: { name: 'Coffee' }, image: 'https://images.unsplash.com/photo-1510707577719-fa7c18305222?w=500&auto=format&fit=crop' },
  { id: 2, name: 'Cafe Latte', price: 3.80, description: 'Double shot of espresso with steamed silky milk.', available: true, category: { name: 'Coffee' }, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop' },
  { id: 3, name: 'Cappuccino', price: 3.80, description: 'Classic espresso with equal parts steamed milk and deep foam.', available: true, category: { name: 'Coffee' }, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop' },
  { id: 4, name: 'Matcha Green Tea Latte', price: 4.20, description: 'Premium stone-ground green tea whisked with steamed milk.', available: true, category: { name: 'Tea' }, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop' },
  { id: 5, name: 'Earl Grey Special', price: 3.00, description: 'Classic black tea infused with premium bergamot oil.', available: true, category: { name: 'Tea' }, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop' },
  { id: 6, name: 'Iced Caramel Macchiato', price: 4.50, description: 'Chilled milk, vanilla syrup, marked with espresso and caramel drizzle.', available: true, category: { name: 'Cold Coffee' }, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop' },
  { id: 7, name: 'Cold Brew Classic', price: 4.00, description: '12-hour slow steeped premium coffee served over ice.', available: true, category: { name: 'Cold Coffee' }, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop' },
  { id: 8, name: 'Gourmet Club Sandwich', price: 6.90, description: 'Smoked chicken, avocado, lettuce, tomato, and garlic aioli.', available: true, category: { name: 'Sandwich' }, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop' },
  { id: 9, name: '1312 Signature Burger', price: 8.90, description: 'Premium Angus beef patty, cheddar, secret sauce, caramelized onions.', available: true, category: { name: 'Burger' }, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop' },
  { id: 10, name: 'Margherita Premium Pizza', price: 10.50, description: 'Fresh mozzarella, san marzano tomato base, extra virgin olive oil, basil.', available: true, category: { name: 'Pizza' }, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop' },
  { id: 11, name: 'Tiramisu Classic', price: 5.50, description: 'Ladyfingers soaked in coffee and rum, layered with whipped mascarpone.', available: true, category: { name: 'Dessert' }, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop' },
  { id: 12, name: 'Fudge Chocolate Cake Slice', price: 5.00, description: 'Decadent multi-layered rich chocolate fudge cake.', available: true, category: { name: 'Cake' }, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop' },
  { id: 13, name: 'Fresh Orange Press', price: 4.50, description: '100% pure fresh cold-pressed Valencia oranges.', available: true, category: { name: 'Juice' }, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop' },
  { id: 14, name: 'Vibe Morning Combo', price: 14.50, description: 'Double Latte, Gourmet Club Sandwich, and Tiramisu dessert.', available: true, category: { name: 'Combo' }, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop' }
];

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  
  const { addToCart } = useContext(CartContext);

  useEffect(() => {
    async function loadProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.success && res.product) {
          setProduct(res.product);
        } else {
          // find in seed
          const seed = SEED_PRODUCTS.find((p) => String(p.id) === String(id));
          setProduct(seed || null);
        }
      } catch (err) {
        console.warn('API error, searching seed list:', err);
        const seed = SEED_PRODUCTS.find((p) => String(p.id) === String(id));
        setProduct(seed || null);
      } finally {
        setLoading(false);
      }
    }
    loadProduct();
  }, [id]);

  if (loading) return <Spinner fullPage />;

  if (!product) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-16 text-center">
        <h2 className="text-xl font-bold text-cafeDark">Product not found.</h2>
        <Link to="/menu" className="text-sm font-semibold text-primary mt-2 inline-block hover:underline">
          Back to Menu
        </Link>
      </div>
    );
  }

  const handleIncrement = () => setQuantity((q) => q + 1);
  const handleDecrement = () => setQuantity((q) => Math.max(1, q - 1));

  const handleAddToCart = () => {
    if (product.available) {
      addToCart(product, quantity);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Back link */}
      <button
        onClick={() => navigate(-1)}
        className="mb-8 flex items-center gap-2 text-xs font-semibold text-cafeDark/50 hover:text-primary transition-colors uppercase tracking-widest"
      >
        <ArrowLeft className="h-4 w-4" /> Back
      </button>

      {/* Main split */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start bg-background border border-primary/5 rounded-3xl p-6 sm:p-10 shadow-sm">
        
        {/* Product Image */}
        <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-cafeDark/5 shadow-inner">
          <img
            src={product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=800&auto=format&fit=crop&q=80'}
            alt={product.name}
            className="w-full h-full object-cover"
          />
          {!product.available && (
            <div className="absolute inset-0 flex items-center justify-center bg-cafeDark/40 backdrop-blur-[2px]">
              <span className="rounded-full bg-red-500 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white">
                Sold Out
              </span>
            </div>
          )}
        </div>

        {/* Product Details info */}
        <div className="flex flex-col h-full space-y-6">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">
              {product.category?.name || 'Cafe Selection'}
            </span>
            <h1 className="font-serif text-3xl font-bold mt-1 text-cafeDark">{product.name}</h1>
            <p className="text-2xl font-bold text-primary mt-2">₹{product.price.toFixed(2)}</p>
          </div>

          <p className="text-sm text-cafeDark/70 leading-relaxed border-t border-primary/10 pt-6">
            {product.description || 'Our chefs select the freshest ingredients and roast premium coffee beans to order. Every item is hand-prepared to guarantee a delightful sensory experience.'}
          </p>

          <div className="space-y-4 pt-6 border-t border-primary/10 mt-auto">
            {/* Quantity Selector */}
            {product.available && (
              <div className="flex items-center gap-4">
                <span className="text-xs font-bold text-cafeDark/50 uppercase tracking-wider">Quantity</span>
                <div className="flex items-center h-10 border border-primary/20 rounded-xl bg-background overflow-hidden">
                  <button
                    onClick={handleDecrement}
                    className="px-3 h-full hover:bg-primary/10 transition-colors text-cafeDark/60"
                  >
                    <Minus className="h-4 w-4" />
                  </button>
                  <span className="w-10 text-center text-sm font-semibold">{quantity}</span>
                  <button
                    onClick={handleIncrement}
                    className="px-3 h-full hover:bg-primary/10 transition-colors text-cafeDark/60"
                  >
                    <Plus className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              onClick={handleAddToCart}
              disabled={!product.available}
              className={`flex items-center justify-center gap-3 h-12 w-full rounded-2xl font-semibold transition-all duration-300 shadow-md ${
                product.available
                  ? 'bg-primary text-cafeDark hover:bg-cafeDark hover:text-primary shadow-primary/10'
                  : 'bg-cafeDark/5 text-cafeDark/30 cursor-not-allowed'
              }`}
            >
              <ShoppingBag className="h-5 w-5" />
              <span>{product.available ? 'Add to Cart' : 'Sold Out'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
