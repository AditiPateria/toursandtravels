import axios from './api';

export const getTours = async () => {
  const response = await axios.get('/tours'); // ✅ Fixed
  return response.data;
};

export const getTourById = async (id) => {
  const response = await axios.get(`/tours/${id}`); // ✅ Fixed
  return response.data;
};

export const searchTours = async (query, destination, minPrice, maxPrice) => {
  const response = await axios.get('/tours/search', {
    params: { query, destination, minPrice, maxPrice }
  }); // ✅ Fixed
  return response.data;
};

export const submitFeedback = async (feedbackData) => {
  const response = await axios.post('/feedback', feedbackData); // ✅ Fixed
  return response.data;
};
