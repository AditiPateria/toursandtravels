import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const About = () => {
  return (
    <Container className="my-5">
      <h2 className="mb-4 text-center" style={{ color: '#3498db' }}>About TravelEase</h2>
      
      <Row className="mb-5">
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Our Story</Card.Title>
              <Card.Text>
                Founded in 2023, TravelEase began with a simple mission: to make travel planning 
                effortless and enjoyable. Our team of travel enthusiasts understands the challenges 
                of organizing trips, and we've built this platform to take the stress out of your 
                travel planning.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6}>
          <Card className="h-100 shadow-sm">
            <Card.Body>
              <Card.Title>Our Mission</Card.Title>
              <Card.Text>
                We strive to connect travelers with the best experiences around the world. 
                Whether you're looking for adventure, relaxation, or cultural immersion, 
                we've got you covered with carefully curated tours and personalized service.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      
      <h3 className="mb-4 text-center" style={{ color: '#2ecc71' }}>Meet Our Team</h3>
      <Row xs={1} md={2} lg={3} className="g-4">
        {[
          { name: 'Alex Johnson', role: 'CEO & Founder', bio: 'Travel enthusiast with 15+ years in the industry.' },
          { name: 'Maria Garcia', role: 'Tour Operations', bio: 'Ensures every tour meets our high standards.' },
          { name: 'Sam Wilson', role: 'Customer Experience', bio: 'Dedicated to making your journey smooth.' },
        ].map((member, index) => (
          <Col key={index}>
            <Card className="h-100 shadow-sm">
              <Card.Img variant="top" src={`https://randomuser.me/api/portraits/${index % 2 === 0 ? 'men' : 'women'}/${index + 10}.jpg`} />
              <Card.Body>
                <Card.Title>{member.name}</Card.Title>
                <Card.Subtitle className="mb-2 text-muted">{member.role}</Card.Subtitle>
                <Card.Text>{member.bio}</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>
    </Container>
  );
};

export default About;