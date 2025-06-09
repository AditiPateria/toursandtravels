import React, { useState, useEffect } from 'react';
import { 
  Card, 
  Container, 
  Row, 
  Col, 
  Form, 
  Button, 
  Carousel 
} from 'react-bootstrap';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../../App.css';

const Tours = () => {
  const [tours, setTours] = useState([]);
  const [filteredTours, setFilteredTours] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [destinationFilter, setDestinationFilter] = useState('');
  const [priceRange, setPriceRange] = useState([0, 10000]);

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get('/api/tours'); // Update with actual API endpoint
        setTours(response.data);
        setFilteredTours(response.data);
      } catch (error) {
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, []);

  useEffect(() => {
    let results = tours;

    if (searchTerm) {
      results = results.filter(tour =>
        tour.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        tour.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (destinationFilter) {
      results = results.filter(tour =>
        tour.destination.toLowerCase().includes(destinationFilter.toLowerCase())
      );
    }

    results = results.filter(tour =>
      tour.price >= priceRange[0] && tour.price <= priceRange[1]
    );

    setFilteredTours(results);
  }, [searchTerm, destinationFilter, priceRange, tours]);

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      comment: "The European tour was absolutely breathtaking! Everything was perfectly organized.",
      rating: 5,
      avatar: "https://randomuser.me/api/portraits/women/32.jpg"
    },
    {
      id: 2,
      name: "Michael Chen",
      comment: "Excellent guides and comfortable accommodations. Will definitely travel with them again!",
      rating: 4,
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    }
  ];

  return (
    <div className="tours-page">
      <section className="hero-section">
        <div className="hero-overlay">
          <Container className="text-center text-white py-5">
            <h1 className="display-4 fw-bold mb-4 fade-in">Discover Your Dream Vacation</h1>
            <p className="lead mb-5 fade-in">Explore the world with our handcrafted tour experiences</p>
            <Button 
              variant="primary" 
              size="lg" 
              href="#available-tours"
              className="px-4 slide-up"
            >
              Browse Tours
            </Button>
          </Container>
        </div>
      </section>

      <section className="py-5 bg-light">
        <Container>
          <h2 className="text-center mb-5">Featured Tours</h2>
          <Row xs={1} md={2} className="g-4">
            {tours.slice(0, 2).map(tour => (
              <Col key={`featured-${tour.id}`}>
                <Card className="h-100 shadow-sm hover-card">
                  <Card.Img 
                    variant="top" 
                    src={tour.imageUrl} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <Card.Body>
                    <Card.Title>{tour.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {tour.destination}
                    </Card.Subtitle>
                    <Card.Text>{tour.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-danger">${tour.price}</span>
                      <span>{tour.durationDays} days</span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <Button variant="primary" size="sm" className="w-100">Book Now</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      <section className="py-5 bg-white">
        <Container>
          <h2 className="text-center mb-5">What Our Travelers Say</h2>
          <Carousel indicators={false} className="testimonial-carousel">
            {testimonials.map(testimonial => (
              <Carousel.Item key={testimonial.id}>
                <div className="text-center px-5">
                  <img 
                    src={testimonial.avatar} 
                    alt={testimonial.name}
                    className="rounded-circle mb-3"
                    width="80"
                    height="80"
                  />
                  <div className="rating mb-3">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <span key={i} className="text-warning">★</span>
                    ))}
                  </div>
                  <blockquote className="fs-5 mb-4">
                    "{testimonial.comment}"
                  </blockquote>
                  <footer className="text-muted">
                    — <strong>{testimonial.name}</strong>
                  </footer>
                </div>
              </Carousel.Item>
            ))}
          </Carousel>
        </Container>
      </section>

      <section id="available-tours" className="py-5 bg-light">
        <Container>
          <h2 className="mb-4 text-center">Available Tours</h2>
          
          <Row className="mb-4 g-3">
            <Col md={6}>
              <Form.Control
                type="text"
                placeholder="Search tours..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="shadow-sm"
              />
            </Col>
            <Col md={3}>
              <Form.Select
                value={destinationFilter}
                onChange={(e) => setDestinationFilter(e.target.value)}
                className="shadow-sm"
              >
                <option value="">All Destinations</option>
                {[...new Set(tours.map(tour => tour.destination))].map(dest => (
                  <option key={dest} value={dest}>{dest}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3}>
              <Form.Range
                min="0"
                max="10000"
                step="100"
                value={priceRange[1]}
                onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                className="shadow-sm"
              />
              <div className="text-center">
                <small>Price up to: ${priceRange[1]}</small>
              </div>
            </Col>
          </Row>
          
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredTours.map(tour => (
              <Col key={tour.id}>
                <Card className="h-100 shadow-sm hover-card">
                  <Card.Img 
                    variant="top" 
                    src={tour.imageUrl} 
                    style={{ height: '200px', objectFit: 'cover' }} 
                  />
                  <Card.Body>
                    <Card.Title>{tour.title}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">
                      {tour.destination}
                    </Card.Subtitle>
                    <Card.Text>{tour.description}</Card.Text>
                    <div className="d-flex justify-content-between align-items-center">
                      <span className="fw-bold text-danger">${tour.price}</span>
                      <span>{tour.durationDays} days</span>
                    </div>
                  </Card.Body>
                  <Card.Footer className="bg-white">
                    <Button variant="primary" size="sm" className="w-100">Book Now</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default Tours;
