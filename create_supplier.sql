USE ecommerce;
INSERT INTO users (name, email, password) VALUES ('Nouveau Fournisseur', 'supplier-new@example.com', '$2a$10$n322.Z0Dq6sS7D4/LdYQv.YcKSTo1X941lJvVXYK.d0QjXgJ8uY3i');
SET @user_id = LAST_INSERT_ID();
INSERT INTO user_roles (user_id, role_id) VALUES (@user_id, 2);
INSERT INTO suppliers (name, contact, user_id) VALUES ('Fournisseur Tech', 'contact@tech.com', @user_id);
