import React, { useContext, useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { SettingsContext } from '../context/SettingsContext';
import api from '../utils/api';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, CreditCard, User, Phone, Tag, CheckCircle } from 'lucide-react';
import { supabase } from '../utils/supabase';

export default function Cart() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    appliedCoupon,
    applyCouponCode,
    removeCoupon,
    subTotal,
    discountAmount,
    cartTotal,
  } = useContext(CartContext);

  const { settings } = useContext(SettingsContext);

  const taxableAmount = Math.max(0, subTotal - discountAmount);
  const taxAmount = taxableAmount * (settings.taxPercentage / 100);
  const [deliveryMethod, setDeliveryMethod] = useState('TAKEAWAY'); // TAKEAWAY or DELIVERY
  const [address, setAddress] = useState('');

  const [coords, setCoords] = useState(null); // { latitude, longitude }
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');

  // Haversine distance helper
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const pLat1 = parseFloat(lat1);
    const pLon1 = parseFloat(lon1);
    const pLat2 = parseFloat(lat2);
    const pLon2 = parseFloat(lon2);
    const R = 6371; // km
    const dLat = (pLat2 - pLat1) * Math.PI / 180;
    const dLon = (pLon2 - pLon1) * Math.PI / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(pLat1 * Math.PI / 180) * Math.cos(pLat2 * Math.PI / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleGetLocation = () => {
    setLocLoading(true);
    setLocError('');


    if (!navigator.geolocation) {
      setLocError('Geolocation is not supported by your browser.');
      setLocLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setCoords({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setLocLoading(false);
      },
      (error) => {
        console.error(error);
        let msg = 'Unable to retrieve location. ';
        if (error.code === error.PERMISSION_DENIED) {
          msg += 'Location permission denied.';
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          msg += 'Location info unavailable.';
        } else if (error.code === error.TIMEOUT) {
          msg += 'Location retrieval timed out.';
        } else {
          msg += 'Please grant location permissions.';
        }
        setLocError(msg);
        setLocLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  };


  let distance = null;
  let isWithinRange = true;
  let calculatedCharges = 0;

  if (deliveryMethod === 'DELIVERY' && coords && coords.latitude !== '' && coords.longitude !== '' && !isNaN(coords.latitude) && !isNaN(coords.longitude) && settings) {
    const shopLat = parseFloat(settings.shopLatitude);
    const shopLon = parseFloat(settings.shopLongitude);
    const rangeLimit = parseFloat(settings.deliveryRangeKm) || 10.0;
    const chargePerKm = parseFloat(settings.deliveryChargePerKm) || 10.0;

    if (!isNaN(shopLat) && !isNaN(shopLon)) {
      distance = calculateDistance(coords.latitude, coords.longitude, shopLat, shopLon);
      if (!isNaN(distance)) {
        if (distance <= rangeLimit) {
          isWithinRange = true;
          calculatedCharges = distance * chargePerKm;
        } else {
          isWithinRange = false;
          calculatedCharges = 0;
        }
      }
    } else {
      isWithinRange = false;
      calculatedCharges = 0;
    }
  }
  
  const deliveryCharges = deliveryMethod === 'DELIVERY' ? calculatedCharges : 0;
  const finalTotalAmount = taxableAmount + taxAmount + deliveryCharges;

  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('CASH');
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [placingOrder, setPlacingOrder] = useState(false);
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!supabase) {
      setAuthLoading(false);
      return;
    }

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
      }
      setAuthLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setUser(session.user);
        setName(session.user.user_metadata?.full_name || session.user.user_metadata?.name || '');
      } else {
        setUser(null);
        setName('');
      }
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Auto-request location access when Delivery Method is set to DELIVERY
  useEffect(() => {
    if (deliveryMethod === 'DELIVERY' && !coords && !locLoading) {
      handleGetLocation();
    }
  }, [deliveryMethod]);

  const handleGoogleSignIn = async () => {
    if (!supabase) {
      setError('Supabase is not configured. Google sign-in is unavailable.');
      return;
    }

    try {
      setAuthLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin + '/cart',
        },
      });
      if (error) throw error;
    } catch (err) {
      setError(err.message || 'Failed to initialize Google authentication');
      setAuthLoading(false);
    }
  };

  const handleSignOut = async () => {
    if (!supabase) {
      localStorage.removeItem('mock_supabase_user');
      setUser(null);
      setName('');
      return;
    }

    try {
      await supabase.auth.signOut();
      setUser(null);
      setName('');
    } catch (err) {
      setError(err.message || 'Sign out failed');
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    setCouponError('');
    if (!couponCode.trim()) return;
    const res = await applyCouponCode(couponCode);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponCode('');
    }
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    setError('');

    if (cartItems.length === 0) {
      setError('Your cart is empty');
      return;
    }
    if (!name.trim()) {
      setError('Please enter your name');
      return;
    }
    if (!phone.trim() || phone.length !== 10) {
      setError('Phone number must be exactly 10 digits');
      return;
    }
    if (deliveryMethod === 'DELIVERY') {
      if (!coords) {
        setError('Please share your live location to calculate delivery fee and verify range.');
        return;
      }
      if (!isWithinRange) {
        setError('Your location is outside our delivery range.');
        return;
      }
      if (!address.trim()) {
        setError('Please enter your delivery address');
        return;
      }
    }

    setPlacingOrder(true);

    try {
      // 1. Create or verify Customer first
      const custRes = await api.post('/customers', { name, phone, address: deliveryMethod === 'DELIVERY' ? address : undefined });
      if (!custRes.success) {
        throw new Error(custRes.message || 'Failed to register customer');
      }

      // 2. Prepare Order Payload
      const orderPayload = {
        name,
        phone,
        address: deliveryMethod === 'DELIVERY' ? address : undefined,
        items: cartItems.map((item) => ({
          productId: item.product.id,
          focusId: item.product.id,
          quantity: item.quantity,
        })),
        paymentMethod,
        deliveryMethod,
        couponCode: appliedCoupon ? appliedCoupon.code : undefined,
        latitude: deliveryMethod === 'DELIVERY' && coords ? coords.latitude : undefined,
        longitude: deliveryMethod === 'DELIVERY' && coords ? coords.longitude : undefined,
      };

      // 3. Post Order
      const orderRes = await api.post('/orders', orderPayload);
      if (orderRes.success) {
        clearCart();
        localStorage.setItem('active_order_id', orderRes.order.id);
        
        // Save to order history list in localStorage
        try {
          const historyIds = JSON.parse(localStorage.getItem('1312_customer_order_ids') || '[]');
          if (!historyIds.includes(orderRes.order.id)) {
            historyIds.push(orderRes.order.id);
            localStorage.setItem('1312_customer_order_ids', JSON.stringify(historyIds));
          }
        } catch (e) {
          console.error('Error saving order history to localStorage:', e);
        }

        navigate('/tracking', { state: { orderId: orderRes.order.id } });
      } else {
        throw new Error(orderRes.message || 'Failed to place order');
      }
    } catch (err) {
      setError(err.message || 'An error occurred while placing the order');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (cartItems.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6 lg:px-8 flex flex-col items-center justify-center text-center space-y-6 min-h-[60vh]">
        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-primary">
          <ShoppingBag className="h-10 w-10 stroke-[1.5]" />
        </div>
        <h1 className="font-serif text-3xl font-bold text-cafeDark">Your Cart is Empty</h1>
        <p className="text-sm text-cafeDark/60 max-w-sm">
          Looks like you haven't added any coffee or delicious treats to your cart yet. Let's find something delicious!
        </p>
        <Link
          to="/menu"
          className="inline-flex h-12 items-center justify-center rounded-2xl bg-primary px-8 text-sm font-semibold text-cafeDark hover:bg-cafeDark hover:text-background transition-all shadow-lg shadow-primary/10"
        >
          Explore Our Menu
          <ArrowRight className="ml-2 h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cafeDark mb-8">Checkout Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side: Cart Items & Customer Info */}
        <div className="lg:col-span-8 space-y-8">
          {/* Cart Items list */}
          <div className="bg-background rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-primary/5 bg-primary/5 flex items-center justify-between">
              <h2 className="font-serif text-lg font-bold text-cafeDark">Selected Items</h2>
              <span className="text-xs font-semibold text-primary">{cartItems.length} items</span>
            </div>
            <ul className="divide-y divide-primary/5 px-6">
              {cartItems.map((item) => (
                <li key={item.product.id} className="py-6 flex items-center gap-4 sm:gap-6">
                  {/* Product Image */}
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-cafeDark/5 border border-primary/5">
                    <img
                      src={item.product.image || 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=150&auto=format&fit=crop'}
                      alt={item.product.name}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  {/* Product Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm sm:text-base font-semibold text-cafeDark truncate">{item.product.name}</h3>
                    <p className="text-xs text-cafeDark/50 mt-0.5 truncate">{item.product.category?.name || 'Beverage'}</p>
                    <div className="text-sm font-bold text-cafeDark mt-2">
                      ₹{(item.product.price * item.quantity).toFixed(2)}
                      <span className="text-xs font-normal text-cafeDark/50 ml-1">(₹{(item.product.price).toFixed(2)} each)</span>
                    </div>
                  </div>

                  {/* Quantity Actions */}
                  <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 shrink-0">
                    <div className="flex items-center border border-primary/10 rounded-xl overflow-hidden bg-background">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="p-1.5 hover:bg-primary/10 text-cafeDark/60 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="h-3.5 w-3.5" />
                      </button>
                      <span className="px-3 text-xs font-bold text-cafeDark">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="p-1.5 hover:bg-primary/10 text-cafeDark/60 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="p-2 text-cafeDark/40 hover:text-red-500 rounded-xl hover:bg-red-55/10 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Details Form */}
          <div className="bg-background rounded-3xl border border-primary/10 p-6 shadow-sm space-y-6">
            <div className="border-b border-primary/5 pb-4">
              <h2 className="font-serif text-lg font-bold text-cafeDark">Customer Information</h2>
              <p className="text-xs text-cafeDark/50 mt-1">Please provide your details so we can track and prep your order.</p>
            </div>

            {!user ? (
              <div className="space-y-4 py-4 flex flex-col items-center justify-center text-center">
                <p className="text-xs text-cafeDark/70 max-w-xs leading-relaxed">
                  To place an order, please authenticate using Google. This secure sign-in keeps your order history synced.
                </p>
                <button
                  type="button"
                  onClick={handleGoogleSignIn}
                  className="flex items-center gap-3 px-5 py-2.5 bg-white border border-primary/20 rounded-2xl text-xs font-bold text-cafeDark hover:bg-[#F8F9F6] transition-all shadow-sm"
                >
                  <svg className="h-4.5 w-4.5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Sign In with Google
                </button>
                {!supabase && (
                  <span className="text-[10px] text-red-500 font-bold uppercase tracking-wider bg-red-50 border border-red-200 px-3 py-1 rounded-xl">
                    ⚠️ Network Connection Error. Please try again later.
                  </span>
                )}
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-primary/5 border border-primary/10 rounded-2xl">
                  <div className="flex items-center gap-3">
                    {user.user_metadata?.avatar_url ? (
                      <img src={user.user_metadata.avatar_url} alt="Google Avatar" className="h-10 w-10 rounded-full border border-primary/20 object-cover" />
                    ) : (
                      <div className="h-10 w-10 rounded-full bg-primary text-cafeDark flex items-center justify-center font-bold">
                        {name.charAt(0) || 'G'}
                      </div>
                    )}
                    <div>
                      <p className="text-xs font-bold text-cafeDark">{name}</p>
                      <p className="text-[10px] text-cafeDark/50">{user.email}</p>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleSignOut}
                    className="text-[10px] font-bold text-cafeDark/50 hover:text-red-500 underline uppercase tracking-wider"
                  >
                    Sign Out
                  </button>
                </div>

                {/* Delivery Option Toggle */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-cafeDark tracking-wide uppercase">Delivery Option</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('TAKEAWAY')}
                      className={`h-11 rounded-xl border text-xs font-bold transition-all ${
                        deliveryMethod === 'TAKEAWAY'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-primary/10 text-cafeDark/60 hover:bg-cafeDark/5'
                      }`}
                    >
                      Take Away
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeliveryMethod('DELIVERY')}
                      className={`h-11 rounded-xl border text-xs font-bold transition-all ${
                        deliveryMethod === 'DELIVERY'
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-primary/10 text-cafeDark/60 hover:bg-cafeDark/5'
                      }`}
                    >
                      Home Delivery
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cafeDark tracking-wide uppercase flex items-center gap-1.5">
                      <User className="h-3.5 w-3.5 text-primary" /> Full Name
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Alice Smith"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full h-12 px-4 rounded-xl border border-primary/15 bg-[#F8F9F6] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-cafeDark"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-xs font-bold text-cafeDark tracking-wide uppercase flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5 text-primary" /> Phone Number
                    </label>
                    <input
                      type="tel"
                      required
                      maxLength={10}
                      placeholder="e.g. 9876543210 (10 digits)"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))}
                      className="w-full h-12 px-4 rounded-xl border border-primary/15 bg-[#F8F9F6] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-cafeDark"
                    />
                  </div>
                </div>

                {deliveryMethod === 'DELIVERY' && (
                  <div className="space-y-4 animate-fade-in border-t border-primary/5 pt-4">
                    {/* Location Permission Notification Banner */}
                    {!coords && (
                      <div className="p-4 bg-primary/10 border border-primary/20 text-cafeDark rounded-2xl flex items-center gap-3 text-xs animate-pulse">
                        <span className="text-base">📍</span>
                        <div>
                          <p className="font-bold">Location Permission Prompted</p>
                          <p className="text-[10px] text-cafeDark/70">Please click "Allow" on the system popup prompt to verify delivery range.</p>
                        </div>
                      </div>
                    )}
                    {/* Geolocation Section */}
                    <div className="bg-[#F8F9F6] border border-primary/10 rounded-2xl p-4 space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <label className="text-xs font-bold text-cafeDark uppercase">Delivery Location Coordinates</label>
                          <p className="text-[10px] text-cafeDark/50 mt-0.5">Share live location or adjust coordinates manually if browser location is inaccurate.</p>
                        </div>
                        <button
                          type="button"
                          onClick={handleGetLocation}
                          disabled={locLoading}
                          className="px-4 py-2 bg-primary text-cafeDark text-xs font-bold rounded-xl hover:bg-cafeDark hover:text-primary transition-all duration-300 shadow-md shrink-0 disabled:opacity-50"
                        >
                          {locLoading ? 'Locating...' : '📍 Share Live Location'}
                        </button>
                      </div>


                      {/* Geolocation Status / Output */}
                      {locError && (
                        <p className="text-xs text-red-500 font-semibold">{locError}</p>
                      )}
                      
                      {coords && coords.latitude !== '' && coords.longitude !== '' && distance !== null && !isNaN(distance) && (
                        <div className="text-[11px] font-semibold text-cafeDark/80 space-y-1 bg-white p-3 rounded-xl border border-primary/5 animate-fade-in">
                          <div className="flex justify-between">
                            <span>Distance to Cafe:</span>
                            <span className={isWithinRange ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
                              {distance.toFixed(2)} km {isWithinRange ? "(Within Range)" : "(Out of Range)"}
                            </span>
                          </div>
                          {!isWithinRange && (
                            <div className="p-2 bg-red-50 border border-red-100 rounded-lg text-[10px] text-red-600 mt-2 font-medium">
                              ⚠️ Distance exceeds our maximum delivery range of {settings.deliveryRangeKm} km. Please select TAKE AWAY or enter closer coordinates.
                            </div>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-bold text-cafeDark tracking-wide uppercase flex items-center gap-1.5">
                        Delivery Address
                      </label>
                      <textarea
                        required
                        rows="3"
                        placeholder="Enter your complete home or office address..."
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        className="w-full p-4 rounded-xl border border-primary/15 bg-[#F8F9F6] focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all text-sm text-cafeDark resize-none"
                      ></textarea>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Side: Order Summary */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-background rounded-3xl border border-primary/10 p-6 shadow-sm space-y-6">
            <h2 className="font-serif text-lg font-bold text-cafeDark border-b border-primary/5 pb-4">Order Summary</h2>

            {/* Price breakdown */}
            <div className="space-y-3">
              <div className="flex justify-between text-sm text-cafeDark/70">
                <span>Subtotal</span>
                <span>₹{subTotal.toFixed(2)}</span>
              </div>
              {appliedCoupon && (
                <div className="flex justify-between text-sm text-primary font-medium">
                  <span className="flex items-center gap-1">
                    Discount ({appliedCoupon.code})
                    <button onClick={removeCoupon} className="text-[10px] text-cafeDark/40 hover:text-primary underline ml-1">remove</button>
                  </span>
                  <span>-₹{discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm text-cafeDark/70">
                <span>Taxes & Service ({settings.taxPercentage}%)</span>
                <span>₹{taxAmount.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-cafeDark/70">
                <span>Delivery Charges</span>
                <span>
                  {deliveryMethod === 'DELIVERY' ? (
                    coords ? (
                      isWithinRange ? (
                        `₹${deliveryCharges.toFixed(2)} (${distance.toFixed(1)} km)`
                      ) : (
                        <span className="text-red-500 font-bold">Out of Range</span>
                      )
                    ) : (
                      <span className="text-primary font-semibold animate-pulse">Share location...</span>
                    )
                  ) : (
                    `₹0.00`
                  )}
                </span>
              </div>
              <div className="border-t border-primary/5 pt-3 flex justify-between text-base font-bold text-cafeDark">
                <span>Total Amount</span>
                <span>₹{finalTotalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Coupons Section */}
            {!appliedCoupon ? (
              <form onSubmit={handleApplyCoupon} className="space-y-2 pt-2 border-t border-primary/5">
                <label className="text-xs font-bold text-cafeDark tracking-wide uppercase flex items-center gap-1.5">
                  <Tag className="h-3.5 w-3.5 text-primary" /> Apply Promo Code
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="e.g. WELCOME10"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    className="flex-1 h-10 px-3 rounded-lg border border-primary/15 bg-[#F8F9F6] uppercase text-xs text-cafeDark outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    className="h-10 px-4 bg-cafeDark text-background text-xs font-bold rounded-lg hover:bg-primary hover:text-cafeDark transition-colors"
                  >
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-red-500 font-medium">{couponError}</p>}
              </form>
            ) : (
              <div className="p-3 bg-primary/10 border border-primary/20 rounded-2xl flex items-center gap-2.5 text-xs text-primary font-semibold">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <span>Coupon "{appliedCoupon.code}" Applied Successfully!</span>
              </div>
            )}

            {/* Payment Method Selector */}
            <div className="space-y-3 pt-4 border-t border-primary/5">
              <label className="text-xs font-bold text-cafeDark tracking-wide uppercase flex items-center gap-1.5">
                <CreditCard className="h-3.5 w-3.5 text-primary" /> Payment Method
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CASH')}
                  className={`h-12 rounded-xl border text-xs font-bold flex flex-col justify-center items-center transition-all ${
                    paymentMethod === 'CASH'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-primary/10 text-cafeDark/60 hover:bg-cafeDark/5'
                  }`}
                >
                  <span>CASH</span>
                  <span className="text-[9px] font-normal opacity-70">Pay at Counter</span>
                </button>
                <button
                  type="button"
                  onClick={() => setPaymentMethod('CARD')}
                  className={`h-12 rounded-xl border text-xs font-bold flex flex-col justify-center items-center transition-all ${
                    paymentMethod === 'CARD'
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-primary/10 text-cafeDark/60 hover:bg-cafeDark/5'
                  }`}
                >
                  <span>UPI</span>
                  <span className="text-[9px] font-normal opacity-70">Scan QR Code</span>
                </button>
              </div>
            </div>

            {error && (
              <div className="p-3.5 bg-red-50 border border-red-200 text-red-600 rounded-2xl text-xs font-medium">
                {error}
              </div>
            )}

            {/* Place Order CTA */}
            {!user ? (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                className="w-full h-12 bg-cafeDark text-background font-bold rounded-2xl hover:bg-primary hover:text-cafeDark transition-all flex items-center justify-center shadow-lg"
              >
                Sign In with Google to Checkout
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder || (deliveryMethod === 'DELIVERY' && (!coords || !isWithinRange))}
                className="w-full h-12 bg-primary text-cafeDark font-bold rounded-2xl hover:bg-cafeDark hover:text-background disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center shadow-lg shadow-primary/10"
              >
                {placingOrder ? 'Processing...' : (deliveryMethod === 'DELIVERY' && !coords) ? 'Share Location to Order' : `Place Order • ₹${finalTotalAmount.toFixed(2)}`}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
