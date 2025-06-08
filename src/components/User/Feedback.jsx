import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getTours, submitFeedback } from '../../services/tourService';
import { Container, Form, Button, Alert, Card, Row, Col, Spinner } from 'react-bootstrap';

const Feedback = () => {
  const { user } = useAuth();
  const [tours, setTours] = useState([]);
  const [selectedTour, setSelectedTour] = useState('');
  const [feedback, setFeedback] = useState({
    rating: 5,
    comment: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!selectedTour) {
      setError('Please select a tour');
      return;
    }
    
    try {
      await submitFeedback({
        userId: user.id,
        tourId: selectedTour,
        ...feedback
      });
      setSubmitted(true);
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
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

  if (submitted) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="success">
          <h4>Thank you for your feedback!</h4>
          <p>We appreciate your time and valuable input.</p>
        </Alert>
        <Button variant="primary" href="/">Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center" style={{ color: '#3498db' }}>Share Your Feedback</h2>
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Select Tour</Form.Label>
                  <Form.Select 
                    value={selectedTour}
                    onChange={(e) => setSelectedTour(e.target.value)}
                    required
                  >
                    <option value="">Choose a tour...</option>
                    {tours.map(tour => (
                      <option key={tour.id} value={tour.id}>{tour.title}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Rating</Form.Label>
                  <div>
                    {[1, 2, 3, 4, 5].map(star => (
                      <span 
                        key={star}
                        style={{
                          cursor: 'pointer',
                          color: star <= feedback.rating ? '#e74c3c' : '#ccc',
                          fontSize: '2rem'
                        }}
                        onClick={() => setFeedback({...feedback, rating: star})}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Comments</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={4}
                    value={feedback.comment}
                    onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Submit Feedback</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Feedback;