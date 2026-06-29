import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import ProductCard from '../components/ProductCard';
import Spinner from '../components/Spinner';
import { ArrowRight, Coffee, Heart, Star, Compass } from 'lucide-react';

const FALLBACK_CATEGORIES = [
  { id: 1, name: 'Coffee', image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=500&auto=format&fit=crop&q=60' },
  { id: 2, name: 'Tea', image: 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=500&auto=format&fit=crop&q=60' },
  { id: 3, name: 'Cold Coffee', image: 'https://images.unsplash.com/photo-1517701604599-bb29b565090c?w=500&auto=format&fit=crop&q=60' },
  { id: 4, name: 'Burger', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60' },
];

const FALLBACK_PRODUCTS = [
  { id: 1, name: 'Cafe Latte', price: 3.80, description: 'Double shot of espresso with steamed silky milk.', image: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=60', available: true, category: { name: 'Coffee' } },
  { id: 2, name: 'Matcha Latte', price: 4.20, description: 'Premium stone-ground green tea whisked with steamed milk.', image: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=60', available: true, category: { name: 'Tea' } },
  { id: 3, name: '1312 Sig Burger', price: 8.90, description: 'Premium Angus beef patty, cheddar, secret sauce, caramelized onions.', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=60', available: true, category: { name: 'Burger' } },
  { id: 4, name: 'Tiramisu Classic', price: 5.50, description: 'Ladyfingers soaked in coffee and rum, layered with whipped mascarpone.', image: 'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=500&auto=format&fit=crop&q=60', available: true, category: { name: 'Dessert' } },
];

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const catRes = await api.get('/categories');
        const prodRes = await api.get('/products');
        
        if (catRes.success && catRes.categories?.length) {
          setCategories(catRes.categories.slice(0, 4));
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }

        if (prodRes.success && prodRes.products?.length) {
          setFeaturedProducts(prodRes.products.slice(0, 4));
        } else {
          setFeaturedProducts(FALLBACK_PRODUCTS);
        }
      } catch (err) {
        console.warn('API error, falling back to mock data:', err);
        setCategories(FALLBACK_CATEGORIES);
        setFeaturedProducts(FALLBACK_PRODUCTS);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <Spinner fullPage />;

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-cafeDark py-24 text-background">
        <div className="absolute inset-0 opacity-20">
          <img
            src="https://images.unsplash.com/photo-1498804103079-a6351b050096?w=1200&auto=format&fit=crop&q=60"
            alt="Cafe ambiance background"
            className="h-full w-full object-cover"
          />
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10 flex flex-col items-center text-center">
          <span className="mb-4 inline-flex items-center gap-1.5 rounded-full bg-primary/20 border border-primary/30 px-3 py-1 text-xs font-semibold text-primary uppercase tracking-widest">
            <Star className="h-3 w-3 fill-primary" /> Established 2026
          </span>
          <h1 className="max-w-3xl font-serif text-4xl sm:text-6xl font-bold tracking-tight leading-none mb-6">
            Where Craft Meets <span className="text-primary">Tranquility</span>
          </h1>
          <p className="max-w-xl text-base sm:text-lg text-background/70 font-light mb-8">
            Experience premium coffee brewing and fresh artisanal bites crafted with precision, served in our modern aesthetic sanctuary.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              to="/menu"
              className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-semibold text-cafeDark hover:bg-background hover:text-cafeDark transition-all shadow-lg shadow-primary/20"
            >
              Order Online
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
            <Link
              to="/about"
              className="inline-flex h-12 items-center justify-center rounded-2xl border border-background/20 px-8 text-sm font-semibold text-background hover:bg-background/10 transition-colors"
            >
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Explore Categories */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Browse menu</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-cafeDark">Popular Categories</h2>
          </div>
          <Link to="/menu" className="flex items-center gap-1 text-sm font-semibold text-primary hover:text-cafeDark transition-colors">
            Full Menu <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/menu?category=${category.id}`}
              className="group relative block aspect-[1.1] overflow-hidden rounded-3xl bg-cafeDark/5 border border-primary/5 shadow-sm"
            >
              <img
                src={category.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=300&auto=format&fit=crop'}
                alt={category.name}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-cafeDark/80 via-cafeDark/20 to-transparent flex items-end p-4">
                <span className="text-sm font-semibold text-background tracking-wide">{category.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 text-center">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Vibe selections</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold mt-1 text-cafeDark">Signature Creations</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Quick About/Vibe Promo Banner */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl overflow-hidden bg-primary/10 border border-primary/20 p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-lg">
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cafeDark">Join the 1312 Community</h3>
            <p className="text-sm text-cafeDark/70 leading-relaxed">
              We brew artisanal coffee and curate fresh culinary snacks with one simple mission: providing a clean, aesthetic, and welcoming space for creators, thinkers, and coffee connoisseurs.
            </p>
            <div className="flex items-center gap-6 text-xs font-semibold text-cafeDark/60 pt-2">
              <div className="flex items-center gap-1"><Coffee className="h-4 w-4 text-primary" /> Local Roasts</div>
              <div className="flex items-center gap-1"><Heart className="h-4 w-4 text-primary" /> Made with Care</div>
              <div className="flex items-center gap-1"><Compass className="h-4 w-4 text-primary" /> Daily Vibes</div>
            </div>
          </div>
          <div className="w-full md:w-auto shrink-0">
            <Link
              to="/about"
              className="inline-flex h-12 w-full md:w-auto items-center justify-center rounded-2xl bg-cafeDark px-8 text-sm font-semibold text-background hover:bg-primary hover:text-cafeDark transition-all"
            >
              Discover More
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
