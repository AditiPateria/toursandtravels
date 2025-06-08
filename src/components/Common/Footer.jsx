import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';

const Footer = () => {
  return (
    <footer className="footer mt-auto py-3">
      <Container>
        <Row>
          <Col md={4}>
            <h5>TravelEase</h5>
            <p>Your perfect travel companion for unforgettable journeys.</p>
          </Col>
          <Col md={4}>
            <h5>Quick Links</h5>
            <ul className="list-unstyled">
              <li><a href="/" style={{ color: 'white' }}>Home</a></li>
              <li><a href="/about" style={{ color: 'white' }}>About Us</a></li>
              <li><a href="/contact" style={{ color: 'white' }}>Contact</a></li>
            </ul>
          </Col>
          <Col md={4}>
            <h5>Contact Info</h5>
            <address>
              123 Travel Street<br />
              Adventure City, AC 12345<br />
              <abbr title="Phone">P:</abbr> (123) 456-7890
            </address>
          </Col>
        </Row>
        <Row>
          <Col className="text-center mt-3">
            <p className="mb-0">&copy; {new Date().getFullYear()} TravelEase. All rights reserved.</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;