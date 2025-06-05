import axios from 'axios';

// Create an axios instance
export  const api = axios.create({
  baseURL: 'http://localhost:9003/api/v1',  // your Django backend API root
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Attach token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Optional: Global response error handling (if desired)
api.interceptors.response.use(
  response => response,
  error => {
    // You could log out the user on a 401 error, or handle refresh token here
    if (error.response?.status === 401) {
      console.warn('Unauthorized — maybe redirect to login?');
      // Optional: clear token or redirect logic
      // localStorage.removeItem('authToken');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

