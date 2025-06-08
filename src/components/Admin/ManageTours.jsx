import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Alert, Modal, Form, Badge } from 'react-bootstrap';
import { getTours, createTour, updateTour, deleteTour } from '../../services/tourService';
import { format } from 'date-fns';

const ManageTours = () => {
  const [tours, setTours] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentTour, setCurrentTour] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    destination: '',
    duration_days: 1,
    price: 0,
    start_date: '',
    end_date: '',
    available_slots: 10,
    image_url: ''
  });

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const data = await getTours();
        setTours(data);
      } catch (err) {
        setError('Failed to fetch tours. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchTours();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === 'duration_days' || name === 'price' || name === 'available_slots' 
        ? parseInt(value) 
        : value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    try {
      if (currentTour) {
        const updatedTour = await updateTour(currentTour.id, formData);
        setTours(tours.map(tour => tour.id === currentTour.id ? updatedTour : tour));
      } else {
        const newTour = await createTour(formData);
        setTours([...tours, newTour]);
      }
      setShowModal(false);
      setCurrentTour(null);
      setFormData({
        title: '',
        description: '',
        destination: '',
        duration_days: 1,
        price: 0,
        start_date: '',
        end_date: '',
        available_slots: 10,
        image_url: ''
      });
    } catch (err) {
      setError(err.message || 'Failed to save tour. Please try again.');
      console.error(err);
    }
  };

  const handleEdit = (tour) => {
    setCurrentTour(tour);
    setFormData({
      title: tour.title,
      description: tour.description,
      destination: tour.destination,
      duration_days: tour.duration_days,
      price: tour.price,
      start_date: format(new Date(tour.start_date), 'yyyy-MM-dd'),
      end_date: format(new Date(tour.end_date), 'yyyy-MM-dd'),
      available_slots: tour.available_slots,
      image_url: tour.image_url || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this tour?')) {
      try {
        await deleteTour(id);
        setTours(tours.filter(tour => tour.id !== id));
      } catch (err) {
        setError('Failed to delete tour. Please try again.');
        console.error(err);
      }
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
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ color: '#3498db' }}>Manage Tours</h2>
        <Button variant="success" onClick={() => setShowModal(true)}>
          Add New Tour
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Title</th>
            <th>Destination</th>
            <th>Duration</th>
            <th>Price</th>
            <th>Dates</th>
            <th>Availability</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {tours.map((tour) => (
            <tr key={tour.id}>
              <td>{tour.title}</td>
              <td>{tour.destination}</td>
              <td>{tour.duration_days} days</td>
              <td>${tour.price}</td>
              <td>
                {format(new Date(tour.start_date), 'MMM dd, yyyy')} - {' '}
                {format(new Date(tour.end_date), 'MMM dd, yyyy')}
              </td>
              <td>
                <Badge bg={tour.available_slots > 5 ? 'success' : 'warning'}>
                  {tour.available_slots} slots
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => handleEdit(tour)}
                >
                  Edit
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(tour.id)}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>{currentTour ? 'Edit Tour' : 'Add New Tour'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                required
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Destination</Form.Label>
                  <Form.Control
                    type="text"
                    name="destination"
                    value={formData.destination}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Image URL</Form.Label>
                  <Form.Control
                    type="text"
                    name="image_url"
                    value={formData.image_url}
                    onChange={handleInputChange}
                    placeholder="https://example.com/image.jpg"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Duration (days)</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="duration_days"
                    value={formData.duration_days}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="10"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>Available Slots</Form.Label>
                  <Form.Control
                    type="number"
                    min="1"
                    name="available_slots"
                    value={formData.available_slots}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Start Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>End Date</Form.Label>
                  <Form.Control
                    type="date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-end">
              <Button variant="secondary" className="me-2" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                {currentTour ? 'Update Tour' : 'Create Tour'}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ManageTours;