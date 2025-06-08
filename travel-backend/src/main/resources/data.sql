-- Only insert roles if they don't exist
INSERT IGNORE INTO roles (name) VALUES ('ROLE_USER');
INSERT IGNORE INTO roles (name) VALUES ('ROLE_ADMIN');

-- Insert a sample admin user if needed (password is 'admin123')
-- INSERT IGNORE INTO users (username, email, password) 
-- VALUES ('admin', 'admin@example.com', '$2a$10$EqWWNXxgZOWwPEFx1KqXAe2SYe1VJg2VH3T5hO.ZW3JzPi0JZ6XkG');

-- Assign admin role to admin user if needed
-- INSERT IGNORE INTO user_roles (user_id, role_id)
-- SELECT u.id, r.id FROM users u, roles r
-- WHERE u.username = 'admin' AND r.name = 'ROLE_ADMIN';