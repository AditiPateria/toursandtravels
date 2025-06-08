// Mock user storage
const users = [];

export const mockLogin = async (credentials) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  const user = users.find(u => u.username === credentials.username);
  if (!user) {
    throw new Error('User not found');
  }
  
  if (user.password !== credentials.password) {
    throw new Error('Invalid password');
  }
  
  return {
    token: 'mock-token-' + Date.now(),
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles
  };
};

export const mockRegister = async (userData) => {
  await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate network delay
  
  // Check if username exists
  if (users.some(u => u.username === userData.username)) {
    throw new Error('Username already exists');
  }
  
  // Check if email exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser = {
    id: users.length + 1,
    ...userData,
    roles: [userData.role || 'ROLE_USER']
  };
  
  users.push(newUser);
  
  return {
    token: 'mock-token-' + Date.now(),
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    roles: newUser.roles
  };
}; 