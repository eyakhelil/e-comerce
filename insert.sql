USE ecommerce;

-- 1. Electronics (category 1)
INSERT INTO products (name, description, price, stock, category_id, supplier_id) VALUES
('iPad Pro 12.9', 'The ultimate iPad experience with M2 chip and Liquid Retina XDR display.', 1099.00, 35, 1, 1),
('Microsoft Surface Pro 9', 'Versatile 2-in-1 laptop-tablet for productivity on the go.', 1199.50, 20, 1, 1),
('Logitech MX Master 3S', 'Advanced wireless mouse for professionals with silent clicks.', 99.99, 100, 1, 1),
('Keychron K2 Mechanical Keyboard', 'Wireless mechanical keyboard for Mac and Windows.', 89.00, 80, 1, 1),
('Anker 737 Power Bank', 'High-capacity 24,000mAh portable charger with 140W output.', 149.99, 60, 1, 1),
('Bose QuietComfort 45', 'Iconic noise-cancelling headphones for premium sound.', 329.00, 45, 1, 1),
('GoPro HERO12 Black', 'Waterproof action camera with 5.3K60 Ultra HD video.', 399.00, 30, 1, 1),
('Samsung Galaxy S24 Ultra', 'AI-powered smartphone with titanium frame and S Pen.', 1299.00, 50, 1, 1),
('Elgato Stream Deck MK.2', 'Studio controller with 15 customizable LCD keys.', 149.99, 40, 1, 1),
('TP-Link Deco AX3000', 'Mesh WiFi 6 system for whole-home coverage.', 179.99, 25, 1, 1);

-- 2. Clothing (category 2)
INSERT INTO products (name, description, price, stock, category_id, supplier_id) VALUES
('Nike Air Force 1', 'Classic everyday sneakers for men and women.', 110.00, 85, 2, 2),
('Adidas Ultraboost', 'High-performance running shoes with incredible energy return.', 190.00, 60, 2, 2),
('Cashmere Sweater', 'Ultra-soft pure cashmere sweater for winter.', 120.00, 40, 2, 2),
('Chino Pants', 'Comfortable stretch chino pants for casual wear.', 49.50, 100, 2, 2),
('Silk Tie', '100% fine silk tie for formal occasions.', 29.90, 75, 2, 2),
('Leather Crossbody Bag', 'Elegant women''s crossbody bag with adjustable strap.', 89.00, 30, 2, 2),
('Wool Fedora Hat', 'Stylish wide-brim wool fedora hat.', 45.00, 20, 2, 2),
('Sports Leggings', 'Breathable high-waisted leggings for workouts.', 35.00, 150, 2, 2),
('Puffer Jacket', 'Water-resistant insulated puffer jacket.', 110.50, 55, 2, 2),
('Cotton Polo Shirt', 'Classic fit breathable cotton polo.', 39.99, 200, 2, 2);

-- 3. Home Appliances (category 3)
INSERT INTO products (name, description, price, stock, category_id, supplier_id) VALUES
('iRobot Roomba j7+', 'Self-emptying robot vacuum with object detection.', 799.00, 15, 3, 1),
('Ninja Professional Blender', '1000-Watt blender for crushing ice and making smoothies.', 99.99, 65, 3, 1),
('KitchenAid Stand Mixer', 'Iconic 5-quart tilt-head kitchen stand mixer.', 449.00, 20, 3, 1),
('Instant Pot Duo 7-in-1', 'Electric pressure cooker, slow cooker, rice cooker.', 89.95, 110, 3, 1),
('LG OLED C3 65" TV', 'Smart TV with perfect blacks and infinite contrast.', 1599.00, 10, 3, 1),
('Breville Espresso Machine', 'Barista Express machine with built-in grinder.', 699.95, 25, 3, 1),
('Cuisinart Toaster Oven', 'Air fryer and convection toaster oven combos.', 229.00, 40, 3, 1),
('Vitamix 5200', 'Professional-grade blender with variable speed control.', 479.00, 30, 3, 1),
('Ring Video Doorbell', '1080p HD video doorbell with enhanced battery life.', 99.99, 90, 3, 1),
('Nest WiFi Pro', 'Google Nest Router with WiFi 6E for up to 2200 sq ft.', 199.99, 45, 3, 1);
