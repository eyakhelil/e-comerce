INSERT IGNORE INTO roles (id, name) VALUES (1, 'CLIENT');
INSERT IGNORE INTO roles (id, name) VALUES (2, 'SUPPLIER');
INSERT IGNORE INTO roles (id, name) VALUES (3, 'SUPERADMIN');

-- Password is 'superadmin123' hashed using BCrypt.
-- Hashes generated via BCrypt typically look like $2a$10$..., here is a pre-generated one for 'superadmin123'.
INSERT IGNORE INTO users (id, name, email, password, created_at)
VALUES (1, 'Super Admin', 'superadmin@admin.com', '$2a$10$wEdbV.3824u41/612dG6WOK29Vz8r3aQd42fF06L2z2YQG0q7Vv/S', NOW());

INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (1, 3);
