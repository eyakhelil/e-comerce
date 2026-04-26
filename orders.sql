USE ecommerce;

-- First order
INSERT INTO orders (user_id, total, status, created_at) VALUES (2, 1199.99, 'DELIVERED', '2026-03-10 14:30:00');
SET @order1 = LAST_INSERT_ID();
INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES (@order1, 1, 1, 1199.99);

-- Second order
INSERT INTO orders (user_id, total, status, created_at) VALUES (2, 139.90, 'SHIPPED', '2026-04-01 10:15:00');
SET @order2 = LAST_INSERT_ID();
INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES (@order2, 4, 2, 25.00);
INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES (@order2, 5, 1, 89.90);

-- Third order
INSERT INTO orders (user_id, total, status, created_at) VALUES (2, 49.99, 'PENDING', NOW());
SET @order3 = LAST_INSERT_ID();
INSERT INTO order_lines (order_id, product_id, quantity, unit_price) VALUES (@order3, 12, 1, 49.99);
