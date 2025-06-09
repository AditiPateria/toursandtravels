import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Base URL for Spring Boot backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: false // We're using token-based auth, not cookies
});

// Request Interceptor
api.interceptors.request.use(
  (config) => {
    console.log('Making request to:', config.url);

    let token = localStorage.getItem('token');

    if (token && typeof token === 'string') {
      token = token.trim(); // ✅ Fix: remove whitespace around the token
      config.headers.Authorization = `Bearer ${token}`;
      console.log('✅ Token found and added to request');
    } else {
      console.warn('⚠️ No token found in localStorage');
    }

    return config;
  },
  (error) => {
    console.error('Request setup error:', error);
    return Promise.reject(error);
  }
);

// Response Interceptor
api.interceptors.response.use(
  (response) => {
    console.log('✅ Response received:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    let errorMessage = 'Something went wrong.';

    if (error.response) {
      const { status, data, config } = error.response;
      console.error(`🚨 Server Error on ${config.url}:`, data);

      if (status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
        errorMessage = 'Session expired. Please login again.';
      } else if (status === 403) {
        errorMessage = 'You are not authorized to access this resource.';
      } else {
        errorMessage = data?.message || data || errorMessage;
      }

    } else if (error.request) {
      console.error('❌ No response from backend:', error.request);
      errorMessage = 'Cannot connect to the server. Please ensure it is running.';
    } else {
      console.error('⚠️ Request Error:', error.message);
      errorMessage = error.message;
    }

    error.message = errorMessage;
    return Promise.reject(error);
  }
);

export default api;
