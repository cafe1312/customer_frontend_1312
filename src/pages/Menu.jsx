import React, { useState, useEffect, useContext } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { CartContext } from '../context/CartContext';
import { Search, ShoppingBag, ArrowRight } from 'lucide-react';

const SEED_CATEGORIES = [
  { id: 1, name: 'Coffee' },
  { id: 2, name: 'Tea' },
  { id: 3, name: 'Cold Coffee' },
  { id: 4, name: 'Sandwich' },
  { id: 5, name: 'Burger' },
  { id: 6, name: 'Pizza' },
  { id: 7, name: 'Dessert' },
  { id: 8, name: 'Cake' },
  { id: 9, name: 'Juice' },
  { id: 10, name: 'Combo' },
];

const SEED_PRODUCTS = [
  { id: 1, name: 'Espresso Single', price: 2.50, description: 'Rich, bold, and intense single shot of espresso.', available: true, categoryId: 1, category: { name: 'Coffee' }, image: 'https://images.unsplash.com/photo-1510707577719-fa7c18305222?w=500&auto=format&fit=crop' },
  { id: 2, name: 'Cafe Latte', price: 3.80, description: 'Double shot of espresso with steamed silky milk.', available: true, categoryId: 1, category: { name: 'Coffee' }, image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop' },
  { id: 3, name: 'Cappuccino', price: 3.80, description: 'Classic espresso with equal parts steamed milk and deep foam.', available: true, categoryId: 1, category: { name: 'Coffee' }, image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=500&auto=format&fit=crop' },
  { id: 4, name: 'Matcha Green Tea Latte', price: 4.20, description: 'Premium stone-ground green tea whisked with steamed milk.', available: true, categoryId: 2, category: { name: 'Tea' }, image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop' },
  { id: 5, name: 'Earl Grey Special', price: 3.00, description: 'Classic black tea infused with premium bergamot oil.', available: true, categoryId: 2, category: { name: 'Tea' }, image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop' },
  { id: 6, name: 'Iced Caramel Macchiato', price: 4.50, description: 'Chilled milk, vanilla syrup, marked with espresso and caramel drizzle.', available: true, categoryId: 3, category: { name: 'Cold Coffee' }, image: 'https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=500&auto=format&fit=crop' },
  { id: 7, name: 'Cold Brew Classic', price: 4.00, description: '12-hour slow steeped premium coffee served over ice.', available: true, categoryId: 3, category: { name: 'Cold Coffee' }, image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop' },
  { id: 8, name: 'Gourmet Club Sandwich', price: 6.90, description: 'Smoked chicken, avocado, lettuce, tomato, and garlic aioli.', available: true, categoryId: 4, category: { name: 'Sandwich' }, image: 'https://images.unsplash.com/photo-1509722747041-616f39b57569?w=500&auto=format&fit=crop' },
  { id: 9, name: '1312 Signature Burger', price: 8.90, description: 'Premium Angus beef patty, cheddar, secret sauce, caramelized onions.', available: true, categoryId: 5, category: { name: 'Burger' }, image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop' },
  { id: 10, name: 'Margherita Premium Pizza', price: 10.50, description: 'Fresh mozzarella, san marzano tomato base, extra virgin olive oil, basil.', available: true, categoryId: 6, category: { name: 'Pizza' }, image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=500&auto=format&fit=crop' },
  { id: 11, name: 'Tiramisu Classic', price: 5.50, description: 'Ladyfingers soaked in coffee and rum, layered with whipped mascarpone.', available: true, categoryId: 7, category: { name: 'Dessert' }, image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop' },
  { id: 12, name: 'Fudge Chocolate Cake Slice', price: 5.00, description: 'Decadent multi-layered rich chocolate fudge cake.', available: true, categoryId: 8, category: { name: 'Cake' }, image: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&auto=format&fit=crop' },
  { id: 13, name: 'Fresh Orange Press', price: 4.50, description: '100% pure fresh cold-pressed Valencia oranges.', available: true, categoryId: 9, category: { name: 'Juice' }, image: 'https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=500&auto=format&fit=crop' },
  { id: 14, name: 'Vibe Morning Combo', price: 14.50, description: 'Double Latte, Gourmet Club Sandwich, and Tiramisu dessert.', available: true, categoryId: 10, category: { name: 'Combo' }, image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop' }
];

export default function Menu() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [dietaryPreference, setDietaryPreference] = useState('ALL'); // ALL, VEG, NONVEG
  
  const { cartCount, cartTotal } = useContext(CartContext);
  
  // Read category filter from URL params
  const activeCategoryId = searchParams.get('category');

  useEffect(() => {
    async function loadMenu() {
      try {
        const [catRes, prodRes] = await Promise.all([
          api.get('/categories'),
          api.get('/products')
        ]);
        
        if (catRes.success && catRes.categories?.length) {
          setCategories(catRes.categories);
        } else {
          setCategories(SEED_CATEGORIES);
        }

        if (prodRes.success && prodRes.products?.length) {
          setProducts(prodRes.products);
        } else {
          setProducts(SEED_PRODUCTS);
        }
      } catch (err) {
        console.warn('API error loading menu, using seeds:', err);
        setCategories(SEED_CATEGORIES);
        setProducts(SEED_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    loadMenu();
  }, []);

  const handleCategorySelect = (id) => {
    if (activeCategoryId === String(id)) {
      searchParams.delete('category');
    } else {
      searchParams.set('category', id);
    }
    setSearchParams(searchParams);
  };

  const filteredProducts = products.filter((product) => {
    const matchesCategory = activeCategoryId
      ? String(product.categoryId) === String(activeCategoryId)
      : true;
    const matchesSearch = searchQuery
      ? product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (product.description && product.description.toLowerCase().includes(searchQuery.toLowerCase()))
      : true;
    const matchesDiet = dietaryPreference === 'ALL'
      ? true
      : dietaryPreference === 'VEG'
      ? product.isVeg === true
      : product.isVeg === false;
    return matchesCategory && matchesSearch && matchesDiet;
  });

  if (loading) return <Spinner fullPage />;

  return (
    <div className="pb-24 pt-6">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Page title & Search bar */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-primary/10 pb-6">
          <div>
            <h1 className="font-serif text-3xl font-bold text-cafeDark">1312 Artisanal Menu</h1>
            <p className="text-sm text-cafeDark/50 mt-1">Fresh ingredients, roasted daily, handcrafted with love.</p>
          </div>
          
          <div className="relative w-full md:w-80">
            <input
              type="text"
              placeholder="Search coffee, burger, sweets..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-11 pl-11 pr-4 bg-background border border-primary/20 rounded-2xl text-sm focus:border-primary focus:ring-1 focus:ring-primary focus:outline-none transition-all placeholder:text-cafeDark/30"
            />
            <Search className="absolute left-4 top-3.5 h-4 w-4 text-cafeDark/30" />
          </div>
        </div>

        {/* Categories Carousel */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide">
          <button
            onClick={() => {
              searchParams.delete('category');
              setSearchParams(searchParams);
            }}
            className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
              !activeCategoryId
                ? 'bg-primary text-cafeDark border-primary'
                : 'bg-background text-cafeDark/70 border-primary/10 hover:border-primary/30'
            }`}
          >
            All Items
          </button>
          {categories.map((category) => {
            const isAvailable = !category.availableFrom || !category.availableTo || (() => {
              const now = new Date();
              const currentVal = now.getHours() * 60 + now.getMinutes();
              const parseMin = (t) => {
                if (!t) return 0;
                const p = t.split(':');
                return p.length >= 2 ? parseInt(p[0]) * 60 + parseInt(p[1]) : 0;
              };
              const fromVal = parseMin(category.availableFrom);
              const toVal = parseMin(category.availableTo);
              return fromVal <= toVal 
                ? (currentVal >= fromVal && currentVal <= toVal)
                : (currentVal >= fromVal || currentVal <= toVal);
            })();

            return (
              <button
                key={category.id}
                onClick={() => handleCategorySelect(category.id)}
                className={`px-5 py-2.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all border ${
                  String(activeCategoryId) === String(category.id)
                    ? 'bg-primary text-cafeDark border-primary shadow-sm'
                    : isAvailable
                    ? 'bg-background text-cafeDark/70 border-primary/10 hover:border-primary/30'
                    : 'bg-cafeDark/5 text-cafeDark/35 border-primary/5 hover:border-primary/10'
                }`}
              >
                {category.name} {!isAvailable && '(Closed)'}
              </button>
            );
          })}
        </div>

        {/* Dietary preference filter buttons */}
        <div className="flex gap-2.5 pb-2 border-b border-primary/5 animate-fade-in">
          <button
            onClick={() => setDietaryPreference('ALL')}
            className={`px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              dietaryPreference === 'ALL'
                ? 'bg-cafeDark text-background border-cafeDark shadow-sm'
                : 'bg-background text-cafeDark/60 border-primary/10 hover:border-primary/20'
            }`}
          >
            All Eats
          </button>
          <button
            onClick={() => setDietaryPreference('VEG')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              dietaryPreference === 'VEG'
                ? 'bg-green-600 text-white border-green-600 shadow-sm'
                : 'bg-background text-green-600 border-green-200 hover:bg-green-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-green-600 border border-white shrink-0"></span>
            Veg Only
          </button>
          <button
            onClick={() => setDietaryPreference('NONVEG')}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl text-xs font-bold transition-all border ${
              dietaryPreference === 'NONVEG'
                ? 'bg-red-600 text-white border-red-600 shadow-sm'
                : 'bg-background text-red-650 border-red-200 hover:bg-red-50'
            }`}
          >
            <span className="w-2.5 h-2.5 rounded-full bg-red-600 border border-white shrink-0"></span>
            Non-Veg Only
          </button>
        </div>

        {/* Products Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-primary/5 rounded-3xl border border-dashed border-primary/20">
            <p className="text-sm font-semibold text-cafeDark/50">No items match your search/filters.</p>
            <button
              onClick={() => {
                setSearchQuery('');
                searchParams.delete('category');
                setSearchParams(searchParams);
              }}
              className="text-xs font-bold text-primary mt-2 hover:underline"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>

      {/* Sticky Bottom Cart Bar for Mobile Devices */}
      {cartCount > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 p-4 bg-background/80 backdrop-blur-md border-t border-primary/10 md:hidden animate-fade-in">
          <Link
            to="/cart"
            className="flex items-center justify-between h-12 w-full bg-primary text-cafeDark rounded-2xl px-6 font-semibold shadow-lg shadow-primary/20 hover:bg-cafeDark hover:text-primary transition-all duration-300"
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <ShoppingBag className="h-5 w-5" />
                <span className="absolute -top-1.5 -right-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-cafeDark text-[8px] font-bold text-primary">
                  {cartCount}
                </span>
              </div>
              <span>View Cart</span>
            </div>
            <div className="flex items-center gap-1">
              <span>₹{cartTotal.toFixed(2)}</span>
              <ArrowRight className="h-4 w-4" />
            </div>
          </Link>
        </div>
      )}
    </div>
  );
}
