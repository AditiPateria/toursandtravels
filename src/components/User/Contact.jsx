import React, { useState } from 'react';
import {Card, Container, Form, Button, Row, Col, Alert } from 'react-bootstrap';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.name || !formData.email || !formData.message) {
      setError('Please fill in all required fields.');
      return;
    }
    
    // In a real app, you would send this data to your backend
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <Container className="my-5 text-center">
        <Alert variant="success">
          <h4>Thank you for contacting us!</h4>
          <p>We've received your message and will get back to you soon.</p>
        </Alert>
        <Button variant="primary" href="/">Back to Home</Button>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center" style={{ color: '#3498db' }}>Contact Us</h2>
      
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label>Your Name</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Email Address</Form.Label>
                  <Form.Control 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Subject</Form.Label>
                  <Form.Control 
                    type="text" 
                    name="subject" 
                    value={formData.subject} 
                    onChange={handleChange} 
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Message</Form.Label>
                  <Form.Control 
                    as="textarea" 
                    rows={5} 
                    name="message" 
                    value={formData.message} 
                    onChange={handleChange} 
                    required 
                  />
                </Form.Group>
                <Button variant="primary" type="submit">Send Message</Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <Row className="mt-5">
        <Col md={4}>
          <h4 style={{ color: '#2ecc71' }}>Our Office</h4>
          <address>
            123 Travel Street<br />
            Adventure City, AC 12345<br />
            <abbr title="Phone">P:</abbr> (123) 456-7890
          </address>
        </Col>
        <Col md={4}>
          <h4 style={{ color: '#2ecc71' }}>Business Hours</h4>
          <p>
            Monday - Friday: 9am to 5pm<br />
            Saturday: 10am to 2pm<br />
            Sunday: Closed
          </p>
        </Col>
        <Col md={4}>
          <h4 style={{ color: '#2ecc71' }}>Get Social</h4>
          <p>
            <a href="#" style={{ color: '#3498db' }}>Facebook</a><br />
            <a href="#" style={{ color: '#3498db' }}>Twitter</a><br />
            <a href="#" style={{ color: '#3498db' }}>Instagram</a>
          </p>
        </Col>
      </Row>
    </Container>
  );
};

export default Contact;