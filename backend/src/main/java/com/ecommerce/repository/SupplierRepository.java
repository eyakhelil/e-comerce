package com.ecommerce.repository;

import com.ecommerce.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface SupplierRepository extends JpaRepository<Supplier, Long> {
    Optional<Supplier> findByUserId(Long userId);
    Optional<Supplier> findByUserEmail(String email);
}
