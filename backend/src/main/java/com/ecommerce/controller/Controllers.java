package com.ecommerce.controller;

import com.ecommerce.dto.*;
import com.ecommerce.entity.*;
import com.ecommerce.service.EcommerceService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class Controllers {

    private final EcommerceService service;

    // --- AUTHENTICATION ---
    @PostMapping("/auth/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.status(201).body(service.register(request));
    }

    @PostMapping("/auth/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(service.login(request));
    }

    // --- CATEGORIES ---
    @GetMapping("/categories")
    public ResponseEntity<List<Category>> getCategories() {
        return ResponseEntity.ok(service.getAllCategories());
    }

    @PostMapping("/categories")
    public ResponseEntity<Category> createCategory(@RequestBody Category category) {
        return ResponseEntity.ok(service.createCategory(category));
    }

    @PutMapping("/categories/{id}")
    public ResponseEntity<Category> updateCategory(@PathVariable Long id, @RequestBody Category category) {
        return ResponseEntity.ok(service.updateCategory(id, category));
    }

    @DeleteMapping("/categories/{id}")
    public ResponseEntity<Void> deleteCategory(@PathVariable Long id) {
        service.deleteCategory(id);
        return ResponseEntity.noContent().build();
    }

    // --- SUPPLIERS ---
    @GetMapping("/suppliers")
    public ResponseEntity<List<Supplier>> getSuppliers() {
        return ResponseEntity.ok(service.getAllSuppliers());
    }

    @PostMapping("/suppliers")
    public ResponseEntity<Supplier> createSupplier(@RequestBody Supplier supplier) {
        return ResponseEntity.ok(service.createSupplier(supplier));
    }

    @PutMapping("/suppliers/{id}")
    public ResponseEntity<Supplier> updateSupplier(@PathVariable Long id, @RequestBody Supplier supplier) {
        return ResponseEntity.ok(service.updateSupplier(id, supplier));
    }

    @DeleteMapping("/suppliers/{id}")
    public ResponseEntity<Void> deleteSupplier(@PathVariable Long id) {
        service.deleteSupplier(id);
        return ResponseEntity.noContent().build();
    }

    // --- PRODUCTS ---
    @GetMapping("/products")
    public ResponseEntity<List<Product>> getProducts() {
        return ResponseEntity.ok(service.getAllProducts());
    }

    @GetMapping("/products/my-products")
    public ResponseEntity<List<Product>> getMyProducts(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getProductsBySupplierEmail(user.getEmail()));
    }

    @GetMapping("/products/{id}")
    public ResponseEntity<Product> getProduct(@PathVariable Long id) {
        return ResponseEntity.ok(service.getProduct(id));
    }

    @PostMapping("/products")
    public ResponseEntity<Product> createProduct(@AuthenticationPrincipal User user,
                                                  @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(service.createProduct(request, user));
    }

    @PutMapping("/products/{id}")
    public ResponseEntity<Product> updateProduct(@PathVariable Long id,
                                                  @Valid @RequestBody ProductRequest request) {
        return ResponseEntity.ok(service.updateProduct(id, request));
    }

    @DeleteMapping("/products/{id}")
    public ResponseEntity<Void> deleteProduct(@AuthenticationPrincipal User user, @PathVariable Long id) {
        service.deleteProduct(id, user);
        return ResponseEntity.noContent().build();
    }

    // --- CART ---
    @GetMapping("/cart")
    public ResponseEntity<Cart> getCart(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getCart(user.getId()));
    }

    @PostMapping("/cart/items")
    public ResponseEntity<Cart> addItem(@AuthenticationPrincipal User user,
                                         @Valid @RequestBody CartItemRequest request) {
        return ResponseEntity.ok(service.addItemToCart(user.getId(), request));
    }

    @PutMapping("/cart/items/{itemId}")
    public ResponseEntity<Cart> updateItem(@AuthenticationPrincipal User user,
                                            @PathVariable Long itemId,
                                            @RequestParam Integer quantity) {
        return ResponseEntity.ok(service.updateCartItem(user.getId(), itemId, quantity));
    }

    @DeleteMapping("/cart/items/{itemId}")
    public ResponseEntity<Cart> removeItem(@AuthenticationPrincipal User user, @PathVariable Long itemId) {
        return ResponseEntity.ok(service.removeCartItem(user.getId(), itemId));
    }

    // --- ORDERS ---
    @PostMapping("/orders/checkout")
    public ResponseEntity<Order> checkout(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.checkout(user.getId()));
    }

    @GetMapping({"/orders", "/orders/my"})
    public ResponseEntity<List<Order>> getMyOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getUserOrders(user.getId()));
    }

    @GetMapping("/orders/all")
    public ResponseEntity<List<Order>> getAllOrders() {
        return ResponseEntity.ok(service.getAllOrders());
    }

    @GetMapping("/orders/supplier")
    public ResponseEntity<List<Order>> getSupplierOrders(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(service.getSupplierOrders(user.getEmail()));
    }

    @PutMapping("/orders/{id}/status")
    public ResponseEntity<Order> updateOrderStatus(@PathVariable Long id,
                                                    @RequestBody Map<String, String> body) {
        return ResponseEntity.ok(service.updateOrderStatus(id, body.get("status")));
    }

    // --- ADMIN: USER MANAGEMENT (SUPERADMIN only) ---
    @GetMapping("/admin/users")
    public ResponseEntity<List<UserResponse>> getAllUsers() {
        return ResponseEntity.ok(service.getAllUsers());
    }

    @PutMapping("/admin/users/{id}/role")
    public ResponseEntity<UserResponse> assignRole(@PathVariable Long id,
                                                    @RequestBody RoleAssignRequest request) {
        return ResponseEntity.ok(service.assignRole(id, request.getRoleId()));
    }

    @DeleteMapping("/admin/users/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        service.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
