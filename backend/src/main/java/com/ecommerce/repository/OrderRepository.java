package com.ecommerce.repository;

import com.ecommerce.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;

public interface OrderRepository extends JpaRepository<Order, Long> {
    List<Order> findByUserId(Long userId);

    @Query("SELECT DISTINCT o FROM Order o JOIN o.orderLines ol WHERE ol.product.supplier.user.email = :email")
    List<Order> findBySupplierEmail(@Param("email") String email);
}
