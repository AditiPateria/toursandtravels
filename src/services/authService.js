import api from './api';

export const login = async (credentials) => {
  try {
    // Trim the username to remove any whitespace
    const cleanedCredentials = {
      ...credentials,
      username: credentials.username.trim()
    };
    
    console.log('Attempting login with credentials:', { username: cleanedCredentials.username });
    const response = await api.post('/api/auth/login', cleanedCredentials);
    console.log('Login response:', response.data);
    
    // Check if we have a valid response
    if (!response.data || typeof response.data !== 'object') {
      console.error('Invalid response format:', response.data);
      throw new Error('Invalid response from server');
    }

    // Extract data with defaults
    const { 
      token, 
      type = 'Bearer',
      id,
      username,
      email,
      roles = []
    } = response.data;

    // Validate required fields
    if (!token) {
      console.error('No token in response:', response.data);
      throw new Error('No authentication token received');
    }

    // Store the complete token with type
    const fullToken = `${type} ${token}`;
    localStorage.setItem('token', fullToken);
    
    // Return the user data
    return {
      token: fullToken,
      id,
      username,
      email,
      roles
    };
  } catch (error) {
    console.error('Login error details:', {
      error: error,
      response: error.response,
      data: error.response?.data,
      status: error.response?.status
    });
    
    if (!error.response) {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }

    // Handle specific error cases
    if (error.response.status === 401) {
      throw new Error('Invalid username or password.');
    } else if (error.response.status === 400) {
      throw new Error(error.response.data?.message || 'Invalid login request.');
    } else if (error.response.status === 500) {
      throw new Error('Server error. Please try again later.');
    }

    throw new Error(error.response?.data?.message || 'Failed to login. Please try again.');
  }
};

export const logout = () => {
  try {
    localStorage.removeItem('token');
  } catch (error) {
    console.error('Error during logout:', error);
  }
};

export const register = async (userData) => {
  try {
    // Trim the username and email before sending
    const cleanedUserData = {
      ...userData,
      username: userData.username.trim(),
      email: userData.email.trim()
    };
    
    console.log('Sending registration request with data:', cleanedUserData);
    const response = await api.post('/api/auth/register', cleanedUserData);
    console.log('Registration response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Registration error details:', error.response || error);
    if (!error.response) {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }
    if (error.response?.status === 409) {
      throw new Error('Username or email already exists');
    }
    throw new Error(error.response?.data?.message || 'Failed to register. Please try again.');
  }
};

export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};