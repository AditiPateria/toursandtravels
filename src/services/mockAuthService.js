// Mock user database
const users = [];

export const login = async (credentials) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  const user = users.find(u => u.username === credentials.username);
  if (!user || user.password !== credentials.password) {
    throw new Error('Invalid username or password');
  }

  const token = btoa(JSON.stringify({ id: user.id, username: user.username, email: user.email }));
  return {
    token,
    id: user.id,
    username: user.username,
    email: user.email,
    roles: user.roles
  };
};

export const logout = () => {
  localStorage.removeItem('token');
};

export const register = async (userData) => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));

  // Validate username
  if (users.some(u => u.username === userData.username)) {
    throw new Error('Username is already taken');
  }

  // Validate email
  if (users.some(u => u.email === userData.email)) {
    throw new Error('Email is already in use');
  }

  // Create new user
  const newUser = {
    id: users.length + 1,
    username: userData.username,
    email: userData.email,
    password: userData.password,
    fullName: userData.fullName,
    phone: userData.phone,
    roles: [userData.role || 'ROLE_USER']
  };

  users.push(newUser);

  const token = btoa(JSON.stringify({ id: newUser.id, username: newUser.username, email: newUser.email }));
  return {
    token,
    id: newUser.id,
    username: newUser.username,
    email: newUser.email,
    roles: newUser.roles
  };
}; 