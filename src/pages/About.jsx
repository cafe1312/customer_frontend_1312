import React from 'react';
import { Link } from 'react-router-dom';
import { Coffee, ShieldCheck, Heart, Sparkles, ArrowRight } from 'lucide-react';

export default function About() {
  return (
    <div className="space-y-16 pb-16">
      {/* Page Header */}
      <section className="bg-cafeDark py-20 text-background text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <img
            src="https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=1000&auto=format&fit=crop"
            alt="Coffee Roaster"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-4">
          <span className="text-xs font-bold text-primary tracking-widest uppercase">Our Story</span>
          <h1 className="font-serif text-4xl sm:text-5xl font-bold tracking-tight">Crafting Everyday Sanctuaries</h1>
          <p className="text-sm sm:text-base text-background/60 font-light max-w-xl mx-auto">
            1312 Cafe was founded with one simple vision: to blend the craft of artisanal coffee with a clean, tranquil, and modern aesthetic space.
          </p>
        </div>
      </section>

      {/* Main Philosophy */}
      <section className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-cafeDark">The 1312 Philosophy</h2>
          <p className="text-sm text-cafeDark/70 leading-relaxed">
            We believe that coffee is more than just a morning caffeine routine. It is a moment of pause, a medium for conversation, and a craft that rewards patience and precision.
          </p>
          <p className="text-sm text-cafeDark/70 leading-relaxed">
            Every bean we roast and brew is ethically sourced from single-origin cooperatives. Our baristas undergo rigorous training to master temperature, grind size, and extraction timing to bring out the perfect flavor profile in your cup.
          </p>
          <div className="grid grid-cols-2 gap-6 pt-4">
            <div className="flex gap-3">
              <ShieldCheck className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cafeDark">100% Organic</h4>
                <p className="text-[11px] text-cafeDark/50 mt-0.5">Ethically & sustainably grown beans</p>
              </div>
            </div>
            <div className="flex gap-3">
              <Heart className="h-6 w-6 text-primary shrink-0" />
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-cafeDark">Crafted with Care</h4>
                <p className="text-[11px] text-cafeDark/50 mt-0.5">Baked fresh in our kitchen daily</p>
              </div>
            </div>
          </div>
        </div>

        <div className="aspect-[4/3] rounded-3xl overflow-hidden shadow-md border border-primary/10">
          <img
            src="https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&auto=format&fit=crop"
            alt="Barista pouring latte art"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      {/* Values Banner */}
      <section className="bg-primary/10 border-y border-primary/20 py-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-primary tracking-widest uppercase">Our Values</span>
            <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cafeDark">What Drives 1312 Cafe</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-background border border-primary/10 p-6 rounded-3xl space-y-3 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Coffee className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-cafeDark">Uncompromising Quality</h4>
              <p className="text-xs text-cafeDark/60 leading-relaxed">
                From micro-lot coffee beans to premium double cream milk, we never compromise on our ingredients.
              </p>
            </div>

            <div className="bg-background border border-primary/10 p-6 rounded-3xl space-y-3 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-cafeDark">Premium Ambiance</h4>
              <p className="text-xs text-cafeDark/60 leading-relaxed">
                Our space is designed to inspire. Minimalist interiors, warm custom wood, and calming plant life create a modern workspace.
              </p>
            </div>

            <div className="bg-background border border-primary/10 p-6 rounded-3xl space-y-3 text-center">
              <div className="h-12 w-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mx-auto">
                <Heart className="h-6 w-6" />
              </div>
              <h4 className="font-bold text-sm text-cafeDark">Community Driven</h4>
              <p className="text-xs text-cafeDark/60 leading-relaxed">
                We support local artists, organize community popups, and provide a welcoming place for neighbors to connect.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-4xl px-4 text-center space-y-6">
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-cafeDark">Ready to Experience the Vibe?</h3>
        <p className="text-sm text-cafeDark/60 max-w-md mx-auto">
          Take a look at our freshly updated menu and choose your brew. We prepare every order fresh to order.
        </p>
        <Link
          to="/menu"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-semibold text-cafeDark hover:bg-cafeDark hover:text-background transition-all shadow-lg shadow-primary/10"
        >
          View Menu Selections
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </section>
    </div>
  );
}
