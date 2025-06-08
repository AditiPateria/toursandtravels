import React, { useState, useEffect } from 'react';
import { Table, Button, Container, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import { getUsers, updateUserRole, deleteUser } from '../../services/adminService';

const ManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedRole, setSelectedRole] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const data = await getUsers();
        setUsers(data);
      } catch (err) {
        setError('Failed to fetch users. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const handleRoleChange = async (userId, role) => {
    try {
      const updatedUser = await updateUserRole(userId, role);
      setUsers(users.map(user => 
        user.id === userId ? updatedUser : user
      ));
      setShowModal(false);
    } catch (err) {
      setError('Failed to update user role. Please try again.');
      console.error(err);
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
      } catch (err) {
        setError('Failed to delete user. Please try again.');
        console.error(err);
      }
    }
  };

  const openRoleModal = (user) => {
    setCurrentUser(user);
    setSelectedRole(user.roles.includes('ROLE_ADMIN') ? 'ROLE_ADMIN' : 'ROLE_USER');
    setShowModal(true);
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
      <h2 className="mb-4" style={{ color: '#3498db' }}>Manage Users</h2>

      {error && <Alert variant="danger">{error}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Username</th>
            <th>Email</th>
            <th>Full Name</th>
            <th>Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.username}</td>
              <td>{user.email}</td>
              <td>{user.fullName}</td>
              <td>
                <Badge bg={user.roles.includes('ROLE_ADMIN') ? 'primary' : 'success'}>
                  {user.roles.includes('ROLE_ADMIN') ? 'Admin' : 'User'}
                </Badge>
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="me-2"
                  onClick={() => openRoleModal(user)}
                >
                  Change Role
                </Button>
                <Button
                  variant="outline-danger"
                  size="sm"
                  onClick={() => handleDelete(user.id)}
                  disabled={user.roles.includes('ROLE_ADMIN')}
                >
                  Delete
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Change User Role</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Select Role for {currentUser?.username}</Form.Label>
              <Form.Select
                value={selectedRole}
                onChange={(e) => setSelectedRole(e.target.value)}
              >
                <option value="ROLE_USER">User</option>
                <option value="ROLE_ADMIN">Admin</option>
              </Form.Select>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={() => handleRoleChange(currentUser.id, selectedRole)}
          >
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>

      {users.length === 0 && !loading && (
        <Alert variant="info">No users found.</Alert>
      )}
    </Container>
  );
};

export default ManageUsers;