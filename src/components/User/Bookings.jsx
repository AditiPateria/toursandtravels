import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getBookings, createBooking, cancelBooking } from '../../services/bookingService';
import { Table, Button, Container, Spinner, Alert, Modal, Form } from 'react-bootstrap';
import { format } from 'date-fns';

const Bookings = () => {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [serverStatus, setServerStatus] = useState('checking'); // 'checking', 'online', 'offline'
  const [newBooking, setNewBooking] = useState({
    tourId: '',
    travelersCount: 1,
    bookingDate: new Date().toISOString().split('T')[0],
    specialRequirements: ''
  });

  useEffect(() => {
    checkServerAndFetchBookings();
  }, []);

  const checkServerAndFetchBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const data = await getBookings();
      setBookings(data || []); // Ensure we always have an array
      setServerStatus('online');
    } catch (err) {
      console.error('Booking fetch error:', err);
      if (err.message.includes('No response from server') || err.message.includes('Failed to fetch')) {
        setServerStatus('offline');
        setError('Unable to connect to the server. Please make sure the backend server is running.');
      } else {
        setServerStatus('online');
        // If it's not a connection error, we're connected but got a different error
        setError(err.message || 'Failed to fetch bookings. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = async (bookingId) => {
    try {
      setError('');
      await cancelBooking(bookingId);
      await checkServerAndFetchBookings(); // Refresh the list after cancellation
    } catch (err) {
      setError(err.message || 'Failed to cancel booking. Please try again.');
    }
  };

  const handleCreateBooking = async (e) => {
    e.preventDefault();
    try {
      setError('');
      await createBooking(newBooking);
      setShowModal(false);
      await checkServerAndFetchBookings(); // Refresh the list after creation
    } catch (err) {
      setError(err.message || 'Failed to create booking. Please try again.');
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Bookings</h2>
        <Button 
          variant="primary" 
          onClick={() => setShowModal(true)}
          disabled={serverStatus === 'offline'}
        >
          New Booking
        </Button>
      </div>

      {serverStatus === 'offline' && (
        <Alert variant="warning">
          <Alert.Heading>Server Connection Issue</Alert.Heading>
          <p>
            Unable to connect to the booking server. Please ensure that:
            <ul>
              <li>The backend server is running</li>
              <li>You are connected to the internet</li>
              <li>The server URL is correct (http://localhost:8080)</li>
            </ul>
          </p>
        </Alert>
      )}

      {error && serverStatus !== 'offline' && (
        <Alert variant="danger" onClose={() => setError('')} dismissible>
          {error}
        </Alert>
      )}

      {serverStatus === 'online' && bookings.length === 0 ? (
        <Alert variant="info">
          You don't have any bookings yet. Click the "New Booking" button to create your first booking!
        </Alert>
      ) : serverStatus === 'online' && (
        <Table responsive striped bordered hover>
          <thead>
            <tr>
              <th>Tour</th>
              <th>Date</th>
              <th>Travelers</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking.id}>
                <td>{booking.tour.title}</td>
                <td>{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</td>
                <td>{booking.numberOfPeople}</td>
                <td>
                  <span className={`badge bg-${
                    booking.status === 'CONFIRMED' ? 'success' :
                    booking.status === 'CANCELLED' ? 'danger' : 'warning'
                  }`}>
                    {booking.status}
                  </span>
                </td>
                <td>
                  {booking.status === 'PENDING' && (
                    <Button
                      variant="danger"
                      size="sm"
                      onClick={() => handleCancel(booking.id)}
                    >
                      Cancel
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Form onSubmit={handleCreateBooking}>
          <Modal.Header closeButton>
            <Modal.Title>New Booking</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Tour ID</Form.Label>
              <Form.Control
                type="number"
                value={newBooking.tourId}
                onChange={(e) => setNewBooking({...newBooking, tourId: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Number of Travelers</Form.Label>
              <Form.Control
                type="number"
                min="1"
                value={newBooking.travelersCount}
                onChange={(e) => setNewBooking({...newBooking, travelersCount: parseInt(e.target.value)})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Booking Date</Form.Label>
              <Form.Control
                type="date"
                value={newBooking.bookingDate}
                onChange={(e) => setNewBooking({...newBooking, bookingDate: e.target.value})}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Special Requirements</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={newBooking.specialRequirements}
                onChange={(e) => setNewBooking({...newBooking, specialRequirements: e.target.value})}
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={() => setShowModal(false)}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              Create Booking
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </Container>
  );
};

export default Bookings;