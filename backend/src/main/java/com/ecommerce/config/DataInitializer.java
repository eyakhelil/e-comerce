package com.ecommerce.config;

import com.ecommerce.entity.Cart;
import com.ecommerce.entity.Role;
import com.ecommerce.entity.RoleName;
import com.ecommerce.entity.User;
import com.ecommerce.repository.CartRepository;
import com.ecommerce.repository.ProductRepository;
import com.ecommerce.repository.RoleRepository;
import com.ecommerce.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashSet;
import java.util.Set;

@Component
@RequiredArgsConstructor
@Slf4j
public class DataInitializer implements ApplicationRunner {

    private final RoleRepository roleRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        // Seed roles
        for (RoleName roleName : RoleName.values()) {
            if (roleRepository.findByName(roleName).isEmpty()) {
                roleRepository.save(Role.builder().name(roleName).build());
                log.info("Seeded role: {}", roleName);
            }
        }

        // Seed default superadmin
        if (userRepository.findByEmail("superadmin@admin.com").isEmpty()) {
            Role superadminRole = roleRepository.findByName(RoleName.SUPERADMIN)
                    .orElseThrow(() -> new RuntimeException("SUPERADMIN role missing"));
            User superadmin = User.builder()
                    .name("Super Admin")
                    .email("superadmin@admin.com")
                    .password(passwordEncoder.encode("superadmin123"))
                    .roles(new HashSet<>(Set.of(superadminRole)))
                    .createdAt(LocalDateTime.now())
                    .build();
            userRepository.save(superadmin);
            log.info("Created default superadmin: superadmin@admin.com / superadmin123");
        }

        // Patch products that have null or empty imageUrl
        productRepository.findAll().forEach(product -> {
            if (product.getImageUrl() == null || product.getImageUrl().trim().isEmpty()) {
                String keyword = product.getName().split(" ")[0].toLowerCase();
                product.setImageUrl("https://source.unsplash.com/400x400/?" + keyword);
                productRepository.save(product);
                log.info("Patched imageUrl for product: {}", product.getName());
            }
        });
    }
}
