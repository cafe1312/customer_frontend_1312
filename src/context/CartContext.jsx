import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const localData = localStorage.getItem('1312_cafe_cart');
    return localData ? JSON.parse(localData) : [];
  });
  
  const [appliedCoupon, setAppliedCoupon] = useState(() => {
    const localCoupon = localStorage.getItem('1312_cafe_coupon');
    return localCoupon ? JSON.parse(localCoupon) : null;
  });

  const [toastMessage, setToastMessage] = useState(null);

  useEffect(() => {
    localStorage.setItem('1312_cafe_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('1312_cafe_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('1312_cafe_coupon');
    }
  }, [appliedCoupon]);

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const addToCart = (product, qty = 1) => {
    setCartItems((prevItems) => {
      const existing = prevItems.find((item) => item.product.id === product.id);
      if (existing) {
        showToast(`Updated ${product.name} quantity in Cart`);
        return prevItems.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + qty }
            : item
        );
      }
      showToast(`Added ${product.name} to Cart`);
      return [...prevItems, { product, quantity: qty }];
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prevItems) => {
      const item = prevItems.find((i) => i.product.id === productId);
      if (item) {
        showToast(`Removed ${item.product.name} from Cart`);
      }
      return prevItems.filter((item) => item.product.id !== productId);
    });
  };

  const updateQuantity = (productId, qty) => {
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }
    setCartItems((prevItems) =>
      prevItems.map((item) =>
        item.product.id === productId ? { ...item, quantity: qty } : item
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setAppliedCoupon(null);
  };

  const applyCouponCode = async (code) => {
    try {
      const res = await api.post('/coupons/validate', { code });
      if (res.success) {
        setAppliedCoupon({ code: code.toUpperCase(), discount: res.discount });
        showToast(`Coupon applied! ${res.discount}% discount`);
        return { success: true, message: res.message };
      } else {
        return { success: false, message: res.message || 'Invalid coupon' };
      }
    } catch (err) {
      return { success: false, message: 'Failed to validate coupon code' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed');
  };

  const subTotal = cartItems.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  
  const discountAmount = appliedCoupon ? subTotal * (appliedCoupon.discount / 100) : 0;
  
  const cartTotal = Math.max(0, subTotal - discountAmount);
  
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        appliedCoupon,
        applyCouponCode,
        removeCoupon,
        subTotal,
        discountAmount,
        cartTotal,
        cartCount,
        toastMessage,
        showToast,
      }}
    >
      {children}
      {toastMessage && (
        <div className="fixed bottom-20 left-1/2 transform -translate-x-1/2 z-50 bg-cafeDark text-background text-sm font-medium px-6 py-3 rounded-full shadow-lg border border-primary/20 flex items-center gap-2 animate-fade-in">
          <span className="w-2 h-2 rounded-full bg-primary animate-ping"></span>
          {toastMessage}
        </div>
      )}
    </CartContext.Provider>
  );
};
