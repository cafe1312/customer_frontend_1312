import React, { createContext, useState, useEffect } from 'react';
import api from '../utils/api';

export const SettingsContext = createContext();

export const SettingsProvider = ({ children }) => {
  const [settings, setSettings] = useState({
    cafeName: "1312 Cafe",
    phone: "+1 234 567 8900",
    email: "contact@1312cafe.com",
    address: "1312 Gourmet St, Culinary City",
    businessHours: {
      open: "08:00",
      close: "22:00",
      days: "Monday - Sunday"
    },
    deliveryCharges: 5.00,
    taxPercentage: 8.0,
    shopLatitude: 19.5786,
    shopLongitude: 72.8223,
    deliveryRangeKm: 10.0,
    deliveryChargePerKm: 10.0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchSettings() {
      try {
        const res = await api.get('/settings');
        if (res.success && res.settings) {
          setSettings(res.settings);
        }
      } catch (err) {
        console.warn('Failed to load settings, using defaults:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchSettings();
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, loading }}>
      {children}
    </SettingsContext.Provider>
  );
};
