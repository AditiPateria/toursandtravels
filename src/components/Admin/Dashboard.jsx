import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTours, getBookings, getUsers } from '../../services/adminService';
import { Container, Row, Col, Card, Spinner, Alert } from 'react-bootstrap';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    tours: 0,
    bookings: 0,
    users: 0,
    revenue: 0
  });
  const [recentBookings, setRecentBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [toursData, bookingsData, usersData] = await Promise.all([
          getTours(),
          getBookings(),
          getUsers()
        ]);
        
        const revenue = bookingsData.reduce((sum, booking) => sum + booking.totalPrice, 0);
        
        setStats({
          tours: toursData.length,
          bookings: bookingsData.length,
          users: usersData.length,
          revenue: revenue
        });
        
        setRecentBookings(bookingsData.slice(0, 5));
      } catch (err) {
        setError('Failed to fetch dashboard data. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" style={{ color: '#3498db' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">{error}</Alert>
      </Container>
    );
  }

  const chartData = [
    { name: 'Tours', value: stats.tours },
    { name: 'Bookings', value: stats.bookings },
    { name: 'Users', value: stats.users }
  ];

  return (
    <Container className="my-5">
      <h2 className="mb-4" style={{ color: '#3498db' }}>Admin Dashboard</h2>
      
      <Row className="mb-4 g-4">
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Tours</Card.Title>
              <Card.Text className="display-6">{stats.tours}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Bookings</Card.Title>
              <Card.Text className="display-6">{stats.bookings}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Users</Card.Title>
              <Card.Text className="display-6">{stats.users}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Revenue</Card.Title>
              <Card.Text className="display-6">${stats.revenue.toFixed(2)}</Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mb-4">
        <Col md={8}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Overview</Card.Title>
              <div style={{ height: '300px' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="value" fill="#3498db" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Recent Bookings</Card.Title>
              {recentBookings.map(booking => (
                <div key={booking.id} className="mb-3">
                  <strong>{booking.tour.title}</strong>
                  <div className="text-muted small">
                    {new Date(booking.bookingDate).toLocaleDateString()} - 
                    ${booking.totalPrice.toFixed(2)}
                  </div>
                </div>
              ))}
              {recentBookings.length === 0 && (
                <div className="text-muted">No recent bookings</div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row>
        <Col>
          <Card className="shadow-sm">
            <Card.Body>
              <Card.Title>Quick Actions</Card.Title>
              <div className="d-flex gap-3">
                <Button variant="primary" href="/admin/tours">Manage Tours</Button>
                <Button variant="success" href="/admin/bookings">Manage Bookings</Button>
                <Button variant="info" href="/admin/users">Manage Users</Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;