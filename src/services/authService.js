import api from './api';

export const login = async (credentials) => {
  try {
    const cleanedCredentials = {
      ...credentials,
      username: credentials.username.trim()
    };

    console.log('Attempting login with credentials:', { username: cleanedCredentials.username });

    const response = await api.post('/api/auth/login', cleanedCredentials);
    const { token, id, username, email, roles = [] } = response.data;

    if (!token) {
      throw new Error('No authentication token received');
    }

    localStorage.setItem('token', token); // ✅ Store raw token only

    return {
      token,
      id,
      username,
      email,
      roles
    };
  } catch (error) {
    console.error('Login error details:', {
      error,
      response: error.response,
      data: error.response?.data,
      status: error.response?.status
    });

    if (!error.response) {
      throw new Error('Unable to connect to the server. Please check if the backend is running.');
    }

    const status = error.response.status;

    if (status === 401) {
      throw new Error('Invalid username or password.');
    } else if (status === 400) {
      throw new Error(error.response.data?.message || 'Invalid login request.');
    } else if (status === 500) {
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
