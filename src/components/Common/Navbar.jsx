import React from 'react';
import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const CustomNavbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Safely get roles as an array to prevent includes error
  const roles = Array.isArray(user?.roles) ? user.roles : [];

  // Optional: Show nothing until auth is initialized
  // Uncomment below if user is initially undefined (for example, during context loading)
  // if (user === undefined) return null;

  return (
    <Navbar expand="lg" variant="dark" sticky="top" bg="dark">
      <Container>
        <Navbar.Brand as={Link} to="/">TravelEase</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Home</Nav.Link>
            <Nav.Link as={Link} to="/about">About Us</Nav.Link>
            <Nav.Link as={Link} to="/contact">Contact</Nav.Link>

            {roles.includes('ROLE_USER') && (
              <>
                <Nav.Link as={Link} to="/bookings">My Bookings</Nav.Link>
                <Nav.Link as={Link} to="/feedback">Feedback</Nav.Link>
              </>
            )}

            {roles.includes('ROLE_ADMIN') && (
              <Nav.Link as={Link} to="/admin">Admin Dashboard</Nav.Link>
            )}
          </Nav>

          <Nav>
            {user ? (
              <>
                <Navbar.Text className="me-2">Welcome, {user.username}</Navbar.Text>
                <Button variant="outline-light" onClick={handleLogout}>Logout</Button>
              </>
            ) : (
              <>
                <Button variant="outline-light" className="me-2" as={Link} to="/login">Login</Button>
                <Button variant="success" as={Link} to="/signup">Sign Up</Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default CustomNavbar;
