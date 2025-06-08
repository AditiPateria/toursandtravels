import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Alert, Badge } from 'react-bootstrap';
import { getBookings as getAdminBookings, updateBookingStatus } from '../../services/adminService';
import { format } from 'date-fns';

const ManageBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const data = await getAdminBookings();
        setBookings(data);
      } catch (err) {
        setError('Failed to fetch bookings. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleStatusChange = async (bookingId, newStatus) => {
    try {
      const updatedBooking = await updateBookingStatus(bookingId, newStatus);
      setBookings(bookings.map(booking => 
        booking.id === bookingId ? updatedBooking : booking
      ));
    } catch (err) {
      setError('Failed to update booking status. Please try again.');
      console.error(err);
    }
  };

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status" style={{ color: '#3498db' }}>
          <span className="visually-hidden">Loading...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4" style={{ color: '#3498db' }}>Manage Bookings</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Tour</th>
            <th>User</th>
            <th>Date</th>
            <th>Travelers</th>
            <th>Total Price</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {bookings.map((booking) => (
            <tr key={booking.id}>
              <td>{booking.tour.title}</td>
              <td>{booking.user.username}</td>
              <td>{format(new Date(booking.bookingDate), 'MMM dd, yyyy')}</td>
              <td>{booking.travelersCount}</td>
              <td>${booking.totalPrice.toFixed(2)}</td>
              <td>
                <Badge 
                  bg={
                    booking.status === 'CONFIRMED' ? 'success' :
                    booking.status === 'CANCELLED' ? 'danger' : 'warning'
                  }
                >
                  {booking.status}
                </Badge>
              </td>
              <td>
                {booking.status === 'PENDING' && (
                  <>
                    <Button
                      variant="outline-success"
                      size="sm"
                      className="me-2"
                      onClick={() => handleStatusChange(booking.id, 'CONFIRMED')}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outline-danger"
                      size="sm"
                      onClick={() => handleStatusChange(booking.id, 'CANCELLED')}
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {bookings.length === 0 && !loading && (
        <Alert variant="info">No bookings found.</Alert>
      )}
    </Container>
  );
};

export default ManageBookings;