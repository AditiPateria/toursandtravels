// Temporary mock authentication service
const mockUsers = [];

export const tempLogin = async (credentials) => {
  console.log('Mock login attempt:', credentials.username);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Always succeed for testing
  return {
    token: `mock-${Date.now()}`,
    user: {
      id: 1,
      username: credentials.username,
      email: `${credentials.username}@example.com`,
      roles: ['ROLE_USER']
    }
  };
};

export const tempSignup = async (userData) => {
  console.log('Mock signup attempt:', userData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Check for existing user
  if (mockUsers.some(u => u.username === userData.username)) {
    throw new Error('Username already taken');
  }
  
  const newUser = {
    id: mockUsers.length + 1,
    ...userData,
    roles: ['ROLE_USER']
  };
  
  mockUsers.push(newUser);
  
  return {
    token: `mock-${Date.now()}`,
    user: newUser
  };
};

export const tempLogout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
}; 