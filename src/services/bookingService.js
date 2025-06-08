import api from './api';

export const getBookings = async () => {
  try {
    const response = await api.get('/api/bookings/my-bookings');
    // If successful but no bookings, return empty array
    return response.data || [];
  } catch (error) {
    console.error('Error fetching bookings:', error);
    // Check if it's a connection error
    if (!error.response) {
      throw new Error('No response from server. Please check if the backend server is running.');
    }
    // If we got a response but it's an error
    throw new Error(error.response?.data?.message || 'Failed to fetch bookings. Please try again later.');
  }
};

export const createBooking = async (bookingData) => {
  try {
    // Validate required fields
    if (!bookingData.tourId) {
      throw new Error('Tour ID is required');
    }
    if (!bookingData.bookingDate) {
      throw new Error('Booking date is required');
    }
    if (!bookingData.travelersCount || bookingData.travelersCount < 1) {
      throw new Error('Number of travelers must be at least 1');
    }

    const response = await api.post('/api/bookings', {
      tourId: parseInt(bookingData.tourId),
      bookingDate: bookingData.bookingDate,
      numberOfPeople: parseInt(bookingData.travelersCount),
      specialRequirements: bookingData.specialRequirements || ''
    });
    return response.data;
  } catch (error) {
    console.error('Error creating booking:', error);
    // Check if it's a connection error
    if (!error.response) {
      throw new Error('Unable to connect to the server. Please check if the backend server is running.');
    }
    // If we got a response but it's an error
    throw new Error(error.response?.data?.message || 'Failed to create booking. Please try again.');
  }
};

export const cancelBooking = async (bookingId) => {
  try {
    const response = await api.delete(`/api/bookings/${bookingId}`);
    return response.data;
  } catch (error) {
    console.error('Error canceling booking:', error);
    // Check if it's a connection error
    if (!error.response) {
      throw new Error('Unable to connect to the server. Please check if the backend server is running.');
    }
    // If we got a response but it's an error
    throw new Error(error.response?.data?.message || 'Failed to cancel booking. Please try again.');
  }
};