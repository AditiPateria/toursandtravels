import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

const Signup = () => {
  const [userData, setUserData] = useState({
    username: '',
    email: '',
    password: '',
    fullName: '',
    phone: '',
    role: 'ROLE_USER'
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Basic validation
      if (userData.password.length < 6) {
        throw new Error('Password must be at least 6 characters long');
      }
      
      if (!userData.email.includes('@')) {
        throw new Error('Please enter a valid email address');
      }

      await signup(userData);
      navigate('/login', { 
        state: { 
          success: true,
          message: 'Registration successful! Please login with your credentials.' 
        }
      });
    } catch (err) {
      console.error('Signup error:', err);
      setError(err.response?.data?.message || err.message || 'Failed to sign up. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: '#2ecc71' }}>Sign Up</h2>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control 
                id="username"
                type="text" 
                name="username" 
                value={userData.username} 
                onChange={handleChange} 
                required 
                minLength={3}
                maxLength={20}
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="email">Email</Form.Label>
              <Form.Control 
                id="email"
                type="email" 
                name="email" 
                value={userData.email} 
                onChange={handleChange} 
                required 
                autoComplete="email"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control 
                id="password"
                type="password" 
                name="password" 
                value={userData.password} 
                onChange={handleChange} 
                required 
                minLength={6}
                autoComplete="new-password"
              />
              <Form.Text className="text-muted">
                Password must be at least 6 characters long
              </Form.Text>
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="fullName">Full Name</Form.Label>
              <Form.Control 
                id="fullName"
                type="text" 
                name="fullName" 
                value={userData.fullName} 
                onChange={handleChange} 
                required 
                autoComplete="name"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="phone">Phone</Form.Label>
              <Form.Control 
                id="phone"
                type="tel" 
                name="phone" 
                value={userData.phone} 
                onChange={handleChange} 
                pattern="[0-9]{10}"
                placeholder="10-digit phone number"
                autoComplete="tel"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="role">Account Type</Form.Label>
              <Form.Select
                id="role"
                name="role"
                value={userData.role}
                onChange={handleChange}
              >
                <option value="ROLE_USER">Regular User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
            <Button 
              variant="success" 
              type="submit" 
              disabled={loading}
              style={{ width: '100%' }}
            >
              {loading ? 'Creating account...' : 'Sign Up'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <p>Already have an account? <a href="/login" style={{ color: '#3498db' }}>Login</a></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Signup;