import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import api from '../utils/api';
import { Loader2, Clipboard, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function Tracking() {
  const location = useLocation();
  
  // Retrieve order ID from location state OR localStorage to persist across refreshes
  const initialOrderId = location.state?.orderId || parseInt(localStorage.getItem('active_order_id')) || null;

  const [orderId, setOrderId] = useState(initialOrderId);
  const [currentOrder, setCurrentOrder] = useState(null);
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState('');
  const [cancelTimeLeft, setCancelTimeLeft] = useState(0);

  // History state
  const [historyOrders, setHistoryOrders] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);

  // Fetch a specific order details
  const fetchOrderDetails = async (id) => {
    if (!id) return;
    setLoadingOrder(true);
    try {
      const res = await api.get(`/orders/${id}`);
      if (res.success && res.order) {
        setCurrentOrder(res.order);
        
        // If order is completed or cancelled, remove it from localStorage so tracking stops on next visit
        if (res.order.status === 'COMPLETED' || res.order.status === 'CANCELLED') {
          localStorage.removeItem('active_order_id');
        }
      } else {
        setError('Order not found');
        localStorage.removeItem('active_order_id');
      }
    } catch (err) {
      setError('Could not retrieve order status');
    } finally {
      setLoadingOrder(false);
    }
  };

  const fetchHistoryOrders = async () => {
    setLoadingHistory(true);
    try {
      const historyIds = JSON.parse(localStorage.getItem('1312_customer_order_ids') || '[]');
      if (historyIds.length === 0) {
        setHistoryOrders([]);
        setLoadingHistory(false);
        return;
      }

      // Fetch all orders in parallel
      const fetchPromises = historyIds.map(async (id) => {
        try {
          const res = await api.get(`/orders/${id}`);
          if (res.success && res.order) {
            return res.order;
          }
        } catch (e) {
          // Skip deleted/404 orders
        }
        return null;
      });

      const results = await Promise.all(fetchPromises);
      
      // Filter out nulls, keep only those placed within the last 3 days, and sort by date descending
      const validOrders = results
        .filter(o => o !== null)
        .filter(o => {
          const elapsedMs = Date.now() - new Date(o.createdAt).getTime();
          return elapsedMs <= 3 * 24 * 60 * 60 * 1000;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

      setHistoryOrders(validOrders);

      // Keep localStorage updated with only these valid active order IDs
      const validIds = validOrders.map(o => o.id);
      localStorage.setItem('1312_customer_order_ids', JSON.stringify(validIds));
    } catch (err) {
      console.warn('Error loading history orders:', err);
    } finally {
      setLoadingHistory(false);
    }
  };

  const handleCancelOrder = async () => {
    if (!currentOrder) return;
    try {
      const res = await api.post(`/orders/${currentOrder.id}/cancel`);
      if (res.success) {
        // Refresh order status
        fetchOrderDetails(currentOrder.id);
      } else {
        alert(res.message || "Failed to cancel order.");
      }
    } catch (err) {
      alert("Error cancelling order.");
    }
  };

  // Trigger search on mount if orderId is present
  useEffect(() => {
    if (orderId) {
      fetchOrderDetails(orderId);
    }
  }, [orderId]);

  // Set up polling for order status
  useEffect(() => {
    if (!orderId) return;
    
    // Poll every 5 seconds for a more responsive tracking experience
    const interval = setInterval(() => {
      fetchOrderDetails(orderId);
    }, 5000);

    return () => clearInterval(interval);
  }, [orderId]);

  // Set up cancellation countdown timer
  useEffect(() => {
    if (!currentOrder || currentOrder.status !== 'PENDING') {
      setCancelTimeLeft(0);
      return;
    }

    const calculateTimeLeft = () => {
      const placedTime = new Date(currentOrder.createdAt).getTime();
      const elapsedSeconds = (Date.now() - placedTime) / 1000;
      const remaining = Math.max(0, 10 - elapsedSeconds);
      return Math.ceil(remaining);
    };

    const initialRemaining = calculateTimeLeft();
    setCancelTimeLeft(initialRemaining);

    if (initialRemaining <= 0) return;

    const timer = setInterval(() => {
      const remaining = calculateTimeLeft();
      setCancelTimeLeft(remaining);
      if (remaining <= 0) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [currentOrder]);

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

  const renderHistoryModal = () => {
    return (
      <div className="fixed inset-0 z-50 bg-cafeDark/50 backdrop-blur-sm flex items-center justify-center p-4">
        <div className="bg-[#FEFFFB] border border-primary/10 max-w-lg w-full max-h-[85vh] rounded-3xl p-5 sm:p-6 shadow-2xl flex flex-col justify-between animate-fade-in text-left">
          <div className="flex items-center justify-between border-b border-primary/5 pb-3">
            <h3 className="font-serif text-base sm:text-lg font-bold text-cafeDark">
              Your 3-Day Order History
            </h3>
            <button 
              onClick={() => setIsHistoryModalOpen(false)} 
              className="p-1.5 rounded-full hover:bg-cafeDark/5 text-cafeDark/60 text-xs font-semibold"
            >
              Close
            </button>
          </div>

          {loadingHistory ? (
            <div className="flex justify-center py-10 my-auto">
              <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
          ) : historyOrders.length === 0 ? (
            <div className="text-center py-10 my-auto">
              <Clipboard className="h-8 w-8 text-primary/30 mx-auto mb-2" />
              <p className="text-xs text-cafeDark/50 font-semibold">No orders recorded in the last 3 days.</p>
            </div>
          ) : (
            <div className="space-y-4 overflow-y-auto pr-1 mt-4 max-h-[50vh] sm:max-h-[55vh]">
              {historyOrders.map((ord) => (
                <div key={ord.id} className="p-4 rounded-2xl border border-primary/10 bg-[#F8F9F6] space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold">
                    <div>
                      <span className="text-cafeDark">Order #{ord.id}</span>
                      <span className="text-[10px] text-cafeDark/40 font-semibold block mt-0.5">
                        {new Date(ord.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-right">
                      <span className="text-primary block">₹{ord.totalAmount.toFixed(2)}</span>
                      <span className="text-[8px] tracking-wider uppercase text-cafeDark/50">{ord.status}</span>
                    </div>
                  </div>
                  
                  {/* Items */}
                  <div className="border-t border-primary/5 pt-2 space-y-1">
                    {ord.items?.map((item) => (
                      <div key={item.id} className="flex justify-between text-[10px] text-cafeDark/70 font-semibold">
                        <span>{item.product?.name} <span className="text-cafeDark/35">x{item.quantity}</span></span>
                        <span>₹{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  {/* Track link */}
                  {ord.status !== 'COMPLETED' && ord.status !== 'CANCELLED' && (
                    <div className="flex justify-end pt-1">
                      <button
                        onClick={() => {
                          setOrderId(ord.id);
                          setCurrentOrder(ord);
                          setIsHistoryModalOpen(false);
                        }}
                        className="px-3 py-1.5 bg-primary text-cafeDark text-[10px] font-bold rounded-lg hover:bg-cafeDark hover:text-primary transition-all"
                      >
                        Track Order Live
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!orderId) {
    return (
      <>
        <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:px-8 flex items-center justify-center">
          <div className="max-w-md w-full text-center py-12 px-6 bg-[#FEFFFB] rounded-3xl border border-primary/10 shadow-sm animate-fade-in">
            <Clipboard className="h-12 w-12 text-primary mx-auto opacity-40 mb-4" />
            <h2 className="font-serif text-xl font-bold text-cafeDark mb-2">No Active Order</h2>
            <p className="text-xs text-cafeDark/60 leading-relaxed mb-6">
              You don't have any active orders currently being tracked. Visit our menu to place a new order!
            </p>
            <div className="flex gap-3 justify-center">
              <Link
                to="/menu"
                className="inline-flex h-11 items-center justify-center rounded-2xl bg-primary px-6 text-xs font-bold text-cafeDark hover:bg-cafeDark hover:text-primary transition-all shadow-md shadow-primary/10"
              >
                Browse Menu
              </Link>
              <button
                onClick={() => {
                  setIsHistoryModalOpen(true);
                  fetchHistoryOrders();
                }}
                className="inline-flex h-11 items-center justify-center rounded-2xl border border-primary/20 px-6 text-xs font-bold text-cafeDark hover:bg-cafeDark/5 transition-all"
              >
                Order History (3 Days)
              </button>
            </div>
          </div>
        </div>

        {/* Modal display */}
        {isHistoryModalOpen && renderHistoryModal()}
      </>
    );
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8 relative">
      <div className="flex flex-col sm:flex-row justify-between items-center max-w-xl mx-auto mb-10 gap-4 text-center sm:text-left">
        <div>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-cafeDark">Track Your Order</h1>
          <p className="text-sm text-cafeDark/60 mt-2">
            Monitor your brew live as it goes from the espresso bar to your hands.
          </p>
        </div>
        <button
          onClick={() => {
            setIsHistoryModalOpen(true);
            fetchHistoryOrders();
          }}
          className="px-4 h-10 bg-cafeDark text-background font-bold text-xs rounded-xl hover:bg-primary hover:text-cafeDark transition-all shadow-sm shrink-0"
        >
          View Last 3 Days History
        </button>
      </div>

      {loadingOrder && !currentOrder ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-8 w-8 text-primary animate-spin" />
        </div>
      ) : currentOrder ? (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-[#FEFFFB] rounded-3xl border border-primary/10 overflow-hidden shadow-sm">
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
                {currentOrder.deliveryMethod === 'DELIVERY' && (
                  <div className="mt-2 text-xs text-cafeDark/60 space-y-1">
                    <p><span className="font-bold">Delivery Address:</span> {currentOrder.address || currentOrder.customer?.address}</p>
                    {currentOrder.distance !== null && currentOrder.distance !== undefined && (
                      <p>
                        <span className="font-bold">Distance:</span> {parseFloat(currentOrder.distance).toFixed(2)} km 
                        <span className="ml-3 font-bold">Delivery Fee:</span> ₹{parseFloat(currentOrder.deliveryCharges || 0).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}
              </div>
              <div className="text-right sm:text-right">
                <div className="text-xs text-cafeDark/50">Total Amount</div>
                <div className="text-lg font-bold text-cafeDark">₹{currentOrder.totalAmount.toFixed(2)}</div>
              </div>
            </div>

            {/* Order Cancellation countdown */}
            {cancelTimeLeft > 0 && (
              <div className="px-6 py-4 bg-red-50/50 border-b border-red-100 flex flex-col sm:flex-row items-center justify-between gap-3">
                <div className="text-xs text-red-700 font-semibold">
                  You can cancel your order within the next <strong className="text-sm font-black text-red-600">{cancelTimeLeft}</strong> seconds.
                </div>
                <button
                  onClick={handleCancelOrder}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
                >
                  Cancel Order
                </button>
              </div>
            )}

            {/* Stepper Status UI */}
            <div className="p-6 sm:p-10">
              {currentOrder.status === 'CANCELLED' ? (
                <div className="p-6 bg-red-50 border border-red-200 rounded-3xl flex items-center gap-4 text-red-700">
                  <AlertTriangle className="h-8 w-8 shrink-0 text-red-500" />
                  <div>
                    <h3 className="font-semibold text-sm">Order Cancelled</h3>
                    <p className="text-xs opacity-80 mt-0.5">This order has been cancelled. If this was an error, please place a new order or speak to us at the counter.</p>
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
        <div className="text-center py-10 bg-[#FEFFFB] rounded-3xl border border-primary/10 p-8">
          <AlertTriangle className="h-10 w-10 text-red-500 mx-auto opacity-60 mb-3" />
          <p className="text-sm text-cafeDark/60">{error || 'Could not load order tracking details.'}</p>
        </div>
      )}

      {/* Modal display */}
      {isHistoryModalOpen && renderHistoryModal()}
    </div>
  );
}
