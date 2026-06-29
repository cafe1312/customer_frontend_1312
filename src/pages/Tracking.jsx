import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../utils/api';
import { Search, Loader2, Clipboard, Clock, CheckCircle2, ChevronRight, AlertTriangle } from 'lucide-react';

export default function Tracking() {
  const location = useLocation();
  const initialOrderId = location.state?.orderId || null;

  const [orderId, setOrderId] = useState(initialOrderId);
  const [phone, setPhone] = useState('');
  const [orders, setOrders] = useState([]);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [searching, setSearching] = useState(false);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState('');

  // Fetch a specific order details
  const fetchOrderDetails = async (id) => {
    setLoadingOrder(true);
    setError('');
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.order) {
        setCurrentOrder(res.order);
      } else {
        setError('Order not found');
      }
    } catch (err) {
      setError('Could not retrieve order status');
    } finally {
      setLoadingOrder(false);
    }
  };

  // Search orders by customer phone number
  const handleSearchOrders = async (e) => {
    e.preventDefault();
    setError('');
    setOrders([]);
    setCurrentOrder(null);

    if (!phone.trim()) {
      setError('Please enter a phone number');
      return;
    }

    setSearching(true);
    try {
      const res = await api.get(`/orders/customer/${phone}`);
      if (res.success && res.orders?.length > 0) {
        setOrders(res.orders);
        // Default to showing the latest order
        const sorted = [...res.orders].sort((a, b) => b.id - a.id);
        setCurrentOrder(sorted[0]);
        setOrderId(sorted[0].id);
      } else {
        setError('No active orders found for this phone number');
      }
    } catch (err) {
      setError('Error searching for orders');
    } finally {
      setSearching(false);
    }
  };

  // Trigger search on mount if initialOrderId is present
  useEffect(() => {
    if (initialOrderId) {
      fetchOrderDetails(initialOrderId);
    }
  }, [initialOrderId]);

  // Set up polling for order status
  useEffect(() => {
    if (!orderId) return;
    const interval = setInterval(() => {
      fetchOrderDetails(orderId);
    }, 10000); // Poll every 10 seconds for real-time updates

    return () => clearInterval(interval);
  }, [orderId]);

  const steps = [
    { label: 'Placed', value: 'PENDING', desc: 'Order received by the kitchen' },
    { label: 'Preparing', value: 'PREPARING', desc: 'Our barista is crafting your items' },
    { label: 'Ready', value: 'READY', desc: 'Fresh & hot, ready to collect' },
    { label: 'Completed', value: 'COMPLETED', desc: 'Order picked up' },
  ];

  const getStepIndex = (status) => {
    if (status === 'CANCELLED') return -1;
    return steps.findIndex((s) => s.value === status);
  };

  const currentStepIndex = currentOrder ? getStepIndex(currentOrder.status) : -1;

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="text-center max-w-xl mx-auto mb-10">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cafeDark">Track Your Order</h1>
        <p className="text-sm text-cafeDark/60 mt-2">
          Monitor your brew live as it goes from the espresso bar to your hands.
        </p>
      </div>

      {/* Phone Number Lookup */}
      <div className="bg-background rounded-3xl border border-primary/10 p-6 shadow-sm mb-8">
        <form onSubmit={handleSearchOrders} className="flex flex-col sm:flex-row gap-4 items-end sm:items-center">
          <div className="flex-1 w-full space-y-1">
            <label className="text-xs font-bold text-cafeDark tracking-wide uppercase">Look up by Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                required
                placeholder="Enter phone number (e.g. 9876543210)"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full h-12 pl-11 pr-4 rounded-2xl border border-primary/15 bg-[#F8F9F6] outline-none focus:border-primary text-sm text-cafeDark"
              />
              <Search className="absolute left-4 top-3.5 h-5 w-5 text-cafeDark/40" />
            </div>
          </div>
          <button
            type="submit"
            disabled={searching}
            className="w-full sm:w-auto h-12 px-8 bg-cafeDark text-background font-bold text-sm rounded-2xl hover:bg-primary hover:text-cafeDark transition-colors flex items-center justify-center gap-2 shadow-lg shadow-cafeDark/5"
          >
            {searching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Find Order'}
          </button>
        </form>
        {error && <p className="text-xs text-red-500 font-semibold mt-3">{error}</p>}
      </div>

      {/* Multiple Orders Selector if phone search was done */}
      {orders.length > 1 && (
        <div className="bg-background rounded-3xl border border-primary/10 p-6 shadow-sm mb-8 space-y-3">
          <h2 className="text-xs font-bold text-cafeDark tracking-wide uppercase">Your Orders</h2>
          <div className="flex gap-3 overflow-x-auto pb-2">
            {orders.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setOrderId(o.id);
                  setCurrentOrder(o);
                }}
                className={`px-4 py-2 rounded-xl border text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                  orderId === o.id
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-primary/10 text-cafeDark hover:bg-cafeDark/5'
                }`}
              >
                <span>Order #{o.id}</span>
                <span className="text-[10px] opacity-70">({o.status})</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Live Tracking Progress */}
      {loadingOrder && !currentOrder ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : currentOrder ? (
        <div className="space-y-6">
          <div className="bg-background rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
            {/* Header info */}
            <div className="px-6 py-6 border-b border-primary/5 bg-primary/5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-primary uppercase bg-primary/10 border border-primary/20 px-2 py-0.5 rounded">
                    Active Order
                  </span>
                  <span className="text-xs text-cafeDark/40">ID: #{currentOrder.id}</span>
                </div>
                <h2 className="font-serif text-lg font-bold text-cafeDark mt-1">
                  Thank you, {currentOrder.customer?.name || 'Customer'}!
                </h2>
              </div>
              <div className="text-right sm:text-right">
                <div className="text-xs text-cafeDark/50">Total Amount</div>
                <div className="text-lg font-bold text-cafeDark">₹{currentOrder.totalAmount.toFixed(2)}</div>
              </div>
            </div>

            {/* Stepper Status UI */}
            <div className="p-6 sm:p-10">
              {currentOrder.status === 'CANCELLED' ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4 text-red-700">
                  <AlertTriangle className="h-8 w-8 shrink-0 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-sm">Order Cancelled</h3>
                    <p className="text-xs opacity-80 mt-0.5">This order has been cancelled by the admin. Please reach out to counter.</p>
                  </div>
                </div>
              ) : (
                <div className="relative">
                  {/* Stepper Line for desktop */}
                  <div className="hidden sm:block absolute left-4 right-4 top-5 h-0.5 bg-primary/10 z-0">
                    <div
                      className="h-full bg-primary transition-all duration-500"
                      style={{ width: `${(Math.max(0, currentStepIndex) / (steps.length - 1)) * 100}%` }}
                    />
                  </div>

                  {/* Steps Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-8 sm:gap-4 relative z-10">
                    {steps.map((step, idx) => {
                      const isCompleted = idx <= currentStepIndex;
                      const isActive = idx === currentStepIndex;

                      return (
                        <div key={step.value} className="flex sm:flex-col items-center sm:text-center gap-4 sm:gap-3">
                          {/* Dot / Icon */}
                          <div
                            className={`h-10 w-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
                              isCompleted
                                ? 'bg-primary border-primary text-cafeDark font-bold shadow-lg shadow-primary/20'
                                : 'bg-background border-primary/25 text-cafeDark/30'
                            }`}
                          >
                            {isCompleted ? (
                              <CheckCircle2 className="h-5 w-5 text-cafeDark" />
                            ) : (
                              <span>{idx + 1}</span>
                            )}
                          </div>

                          {/* Info */}
                          <div className="space-y-1">
                            <h4
                              className={`text-sm font-bold transition-colors ${
                                isActive ? 'text-primary' : isCompleted ? 'text-cafeDark' : 'text-cafeDark/40'
                              }`}
                            >
                              {step.label}
                            </h4>
                            <p className="text-[11px] text-cafeDark/50 leading-tight max-w-[150px] mx-auto">
                              {step.desc}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Items list summary */}
            <div className="px-6 py-6 border-t border-primary/5 bg-cafeDark/5">
              <h3 className="text-xs font-bold text-cafeDark tracking-wide uppercase mb-3">Order Items</h3>
              <div className="space-y-2">
                {currentOrder.items?.map((item) => (
                  <div key={item.id} className="flex justify-between items-center text-xs">
                    <span className="text-cafeDark/80 font-medium">
                      {item.product?.name} <span className="text-primary font-bold ml-1">x{item.quantity}</span>
                    </span>
                    <span className="font-bold text-cafeDark">₹{(item.price * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="text-center py-10 bg-background rounded-3xl border border-primary/10 p-8">
          <Clipboard className="h-10 w-10 text-primary mx-auto opacity-40 mb-3" />
          <p className="text-sm text-cafeDark/60">No order currently selected. Look up using your phone number above.</p>
        </div>
      )}
    </div>
  );
}
