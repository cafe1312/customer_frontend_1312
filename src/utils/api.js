const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

const api = {
  get: async (url, headers = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return res.json();
  },

  post: async (url, body, headers = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  put: async (url, body, headers = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
    return res.json();
  },

  delete: async (url, headers = {}) => {
    const res = await fetch(`${API_BASE_URL}${url}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });
    return res.json();
  },
};

export default api;
