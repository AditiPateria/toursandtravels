import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Form, Button, Alert, Container, Card } from 'react-bootstrap';

const Login = () => {
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Check for success message from registration
    if (location.state?.success) {
      setSuccess(location.state.message);
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Remove any leading spaces as they type
    const cleanedValue = name === 'username' ? value.replace(/^\s+/, '') : value;
    setCredentials(prev => ({
      ...prev,
      [name]: cleanedValue
    }));
    // Clear messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    if (name === 'username') {
      // Trim any remaining spaces on blur
      setCredentials(prev => ({
        ...prev,
        username: value.trim()
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);
    
    try {
      // Final cleanup of credentials
      const cleanedCredentials = {
        username: credentials.username.trim(),
        password: credentials.password
      };
      console.log('Attempting login with:', { username: cleanedCredentials.username });
      await login(cleanedCredentials);
      navigate('/');
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Invalid username or password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '80vh' }}>
      <Card style={{ width: '400px' }} className="shadow">
        <Card.Body>
          <h2 className="text-center mb-4" style={{ color: '#3498db' }}>Login</h2>
          {success && <Alert variant="success">{success}</Alert>}
          {error && <Alert variant="danger">{error}</Alert>}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="username">Username</Form.Label>
              <Form.Control 
                id="username"
                type="text" 
                name="username" 
                value={credentials.username}
                onChange={handleChange}
                onBlur={handleBlur}
                required
                autoComplete="username"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label htmlFor="password">Password</Form.Label>
              <Form.Control 
                id="password"
                type="password" 
                name="password" 
                value={credentials.password}
                onChange={handleChange}
                required
                autoComplete="current-password"
              />
            </Form.Group>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={loading}
              style={{ backgroundColor: '#3498db', borderColor: '#3498db', width: '100%' }}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </Form>
          <div className="mt-3 text-center">
            <p>Don't have an account? <a href="/signup" style={{ color: '#2ecc71' }}>Sign Up</a></p>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default Login;