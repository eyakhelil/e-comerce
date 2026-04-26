package com.ecommerce.service;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.repository.*;
import com.ecommerce.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class EcommerceService {

    private final UserRepository userRepository;
    private final RoleRepository roleRepository;
    private final CategoryRepository categoryRepository;
    private final SupplierRepository supplierRepository;
    private final ProductRepository productRepository;
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final OrderRepository orderRepository;
    private final OrderLineRepository orderLineRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final EmailService emailService;

    // --- AUTHENTICATION ---
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            throw new RuntimeException("Email is already registered");
        }
        Role clientRole = roleRepository.findByName(RoleName.CLIENT)
                .orElseThrow(() -> new RuntimeException("CLIENT role not found. Ensure data initializer has run."));

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .roles(new HashSet<>(Set.of(clientRole)))
                .createdAt(LocalDateTime.now())
                .build();
        userRepository.save(user);

        Cart cart = Cart.builder().user(user).build();
        cartRepository.save(cart);

        String token = jwtUtil.generateToken(user);
        List<String> roles = getRoleNames(user);

        // Envoyer l'email de bienvenue
        try {
            emailService.sendWelcomeEmail(user.getEmail(), user.getName());
        } catch (Exception e) {
            log.warn("Echec de l'envoi de l'email de bienvenue à {}: {}", user.getEmail(), e.getMessage());
        }

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), roles);
    }

    public AuthResponse login(AuthRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        String token = jwtUtil.generateToken(user);
        List<String> roles = getRoleNames(user);
        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), roles);
    }

    // --- USER MANAGEMENT (SUPERADMIN) ---
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::toUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional
    public UserResponse assignRole(Long userId, Long roleId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Role role = roleRepository.findById(roleId)
                .orElseThrow(() -> new RuntimeException("Role not found"));
        user.getRoles().clear();
        user.getRoles().add(role);
        userRepository.save(user);

        // Auto-create Supplier record if role is SUPPLIER and not exists
        if (role.getName() == RoleName.SUPPLIER) {
            if (supplierRepository.findByUserEmail(user.getEmail()).isEmpty()) {
                Supplier s = Supplier.builder()
                        .name(user.getName())
                        .user(user)
                        .contact(user.getEmail())
                        .build();
                supplierRepository.save(s);
            }
        }

        return toUserResponse(user);
    }

    public void deleteUser(Long userId) {
        userRepository.deleteById(userId);
    }

    private UserResponse toUserResponse(User user) {
        return UserResponse.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .roles(getRoleNames(user))
                .createdAt(user.getCreatedAt())
                .build();
    }

    private List<String> getRoleNames(User user) {
        return user.getRoles().stream()
                .map(r -> r.getName().name())
                .collect(Collectors.toList());
    }

    // --- CATEGORY ---
    public List<Category> getAllCategories() { return categoryRepository.findAll(); }
    public Category createCategory(Category category) { return categoryRepository.save(category); }
    public Category updateCategory(Long id, Category data) {
        Category cat = categoryRepository.findById(id).orElseThrow();
        cat.setName(data.getName());
        cat.setDescription(data.getDescription());
        return categoryRepository.save(cat);
    }
    public void deleteCategory(Long id) { categoryRepository.deleteById(id); }

    // --- SUPPLIER ---
    public List<Supplier> getAllSuppliers() { return supplierRepository.findAll(); }
    public Supplier createSupplier(Supplier supplier) { return supplierRepository.save(supplier); }
    public Supplier updateSupplier(Long id, Supplier data) {
        Supplier s = supplierRepository.findById(id).orElseThrow();
        s.setName(data.getName());
        s.setContact(data.getContact());
        return supplierRepository.save(s);
    }
    public void deleteSupplier(Long id) { supplierRepository.deleteById(id); }

    // --- PRODUCT ---
    public List<Product> getAllProducts() { return productRepository.findAll(); }
    public Product getProduct(Long id) { return productRepository.findById(id).orElseThrow(); }
    public List<Product> getProductsBySupplierEmail(String email) {
        return productRepository.findBySupplierUserEmail(email);
    }

    public Product createProduct(ProductRequest request, User authenticatedUser) {
        List<Category> categories = new java.util.ArrayList<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories = categoryRepository.findAllById(request.getCategoryIds());
        }
        Supplier supplier = request.getSupplierId() != null
                ? supplierRepository.findById(request.getSupplierId()).orElse(null) : null;
        
        // Auto-assign supplier if authenticated user is a supplier and no ID provided
        if (supplier == null && authenticatedUser != null) {
            supplier = supplierRepository.findByUserEmail(authenticatedUser.getEmail()).orElse(null);
        }

        String finalImageUrl = request.getImageUrl();
        if (finalImageUrl == null || finalImageUrl.trim().isEmpty()) {
            String keyword = request.getName().split(" ")[0].toLowerCase();
            finalImageUrl = "https://source.unsplash.com/400x400/?" + keyword;
        }
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .stock(request.getStock())
                .categories(categories)
                .supplier(supplier)
                .imageUrl(finalImageUrl)
                .build();
        return productRepository.save(product);
    }

    public Product updateProduct(Long id, ProductRequest request) {
        Product product = productRepository.findById(id).orElseThrow();
        List<Category> categories = new java.util.ArrayList<>();
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            categories = categoryRepository.findAllById(request.getCategoryIds());
        }
        Supplier supplier = request.getSupplierId() != null
                ? supplierRepository.findById(request.getSupplierId()).orElse(null) : null;
        String finalImageUrl = request.getImageUrl();
        if (finalImageUrl == null || finalImageUrl.trim().isEmpty()) {
            String keyword = request.getName().split(" ")[0].toLowerCase();
            finalImageUrl = "https://source.unsplash.com/400x400/?" + keyword;
        }
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setPrice(request.getPrice());
        product.setStock(request.getStock());
        product.setCategories(categories);
        product.setSupplier(supplier);
        product.setImageUrl(finalImageUrl);
        return productRepository.save(product);
    }

    public void deleteProduct(Long id, User authenticatedUser) {
        productRepository.deleteById(id);
    }

    // --- CART ---
    public Cart getCart(Long userId) {
        return cartRepository.findByUserId(userId).orElseThrow();
    }

    @Transactional
    public Cart addItemToCart(Long userId, CartItemRequest request) {
        Cart cart = getCart(userId);
        Product product = productRepository.findById(request.getProductId()).orElseThrow();
        CartItem existingItem = cart.getItems().stream()
                .filter(item -> item.getProduct().getId().equals(product.getId()))
                .findFirst().orElse(null);
        if (existingItem != null) {
            existingItem.setQuantity(existingItem.getQuantity() + request.getQuantity());
        } else {
            CartItem newItem = CartItem.builder()
                    .cart(cart).product(product).quantity(request.getQuantity()).build();
            cart.getItems().add(newItem);
        }
        return cartRepository.save(cart);
    }

    @Transactional
    public Cart updateCartItem(Long userId, Long itemId, Integer quantity) {
        Cart cart = getCart(userId);
        CartItem item = cartItemRepository.findById(itemId).orElseThrow();
        if (item.getCart().getId().equals(cart.getId())) {
            item.setQuantity(quantity);
            cartItemRepository.save(item);
        }
        return cart;
    }

    @Transactional
    public Cart removeCartItem(Long userId, Long itemId) {
        Cart cart = getCart(userId);
        cart.getItems().removeIf(item -> item.getId().equals(itemId));
        return cartRepository.save(cart);
    }

    // --- ORDER ---
    @Transactional
    public Order checkout(Long userId) {
        Cart cart = getCart(userId);
        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal total = BigDecimal.ZERO;
        for (CartItem item : cart.getItems()) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for: " + product.getName());
            }
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
            total = total.add(product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity())));
        }

        // 1. Pre-create the Order
        Order order = Order.builder()
                .user(cart.getUser())
                .total(total)
                .status("PENDING")
                .createdAt(LocalDateTime.now())
                .build();

        // 2. Create OrderLines and link them to the order
        List<OrderLine> lines = cart.getItems().stream().map(item ->
            OrderLine.builder()
                .order(order)
                .product(item.getProduct())
                .quantity(item.getQuantity())
                .unitPrice(item.getProduct().getPrice())
                .build()
        ).collect(Collectors.toList());

        // 3. Set the lines on the order (Hibernate will handle cascading)
        order.setOrderLines(lines);

        // 4. Save the order (this handles everything)
        Order savedOrder = orderRepository.save(order);

        // 5. Clean up cart
        cart.getItems().clear();
        cartRepository.save(cart);

        // 6. Send confirmation email asynchronously
        try {
            emailService.sendOrderConfirmationEmail(savedOrder.getUser().getEmail(), savedOrder);
        } catch (Exception e) {
            log.warn("Email dispatch failed for order #{}: {}", savedOrder.getId(), e.getMessage());
        }

        return savedOrder;
    }

    public List<Order> getUserOrders(Long userId) {
        return orderRepository.findByUserId(userId);
    }

    public List<Order> getSupplierOrders(String email) {
        return orderRepository.findBySupplierEmail(email);
    }

    public List<Order> getAllOrders() {
        return orderRepository.findAll();
    }

    @Transactional
    public Order updateOrderStatus(Long orderId, String status) {
        Order order = orderRepository.findById(orderId).orElseThrow();
        order.setStatus(status);
        return orderRepository.save(order);
    }
}
