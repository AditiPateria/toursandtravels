import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080'; // Base URL for Spring Boot backend

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  withCredentials: false // Set to false since we're using token-based auth
});

// Add request interceptor
api.interceptors.request.use(
  (config) => {
    // Add debug logging
    console.log('Making request to:', config.url);
    
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Token found and added to request');
    } else {
      console.log('No token found in localStorage');
    }
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor
api.interceptors.response.use(
  (response) => {
    // Add debug logging
    console.log('Received successful response:', {
      url: response.config.url,
      status: response.status,
      data: response.data
    });
    return response;
  },
  (error) => {
    let errorMessage = 'An unexpected error occurred';
    
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      errorMessage = error.response.data?.message || error.response.data || errorMessage;
      console.error('Server Error:', {
        url: error.config.url,
        status: error.response.status,
        data: error.response.data
      });
      
      // Handle 401 Unauthorized
      if (error.response.status === 401) {
        localStorage.removeItem('token'); // Clear invalid token
        window.location.href = '/login'; // Redirect to login
        return Promise.reject(new Error('Session expired. Please login again.'));
      }
    } else if (error.request) {
      // The request was made but no response was received
      errorMessage = 'No response from server. Please check if the server is running.';
      console.error('Network Error:', error.request);
    } else {
      // Something happened in setting up the request
      errorMessage = error.message;
      console.error('Request Error:', error.message);
    }

    error.message = errorMessage;
    return Promise.reject(error);
  }
);

export default api;