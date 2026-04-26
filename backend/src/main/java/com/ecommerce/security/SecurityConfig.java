package com.ecommerce.security;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final CustomUserDetailsService userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .authorizeHttpRequests(auth -> auth
                // Public
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/products/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/suppliers/**").permitAll()
                // CLIENT only
                .requestMatchers("/api/cart/**").hasRole("CLIENT")
                .requestMatchers(HttpMethod.POST, "/api/orders/checkout").hasRole("CLIENT")
                .requestMatchers(HttpMethod.GET, "/api/orders/my").hasRole("CLIENT")
                // SUPPLIER + SUPERADMIN + CLIENT (refactored as per schema)
                .requestMatchers(HttpMethod.POST, "/api/products/**").hasAnyRole("CLIENT", "SUPPLIER", "SUPERADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/products/**").hasAnyRole("CLIENT", "SUPPLIER", "SUPERADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/products/**").hasAnyRole("CLIENT", "SUPPLIER", "SUPERADMIN")
                .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAnyRole("CLIENT", "SUPPLIER", "SUPERADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/categories/**").hasAnyRole("CLIENT", "SUPPLIER", "SUPERADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("SUPERADMIN")
                .requestMatchers("/api/suppliers/**").hasRole("SUPERADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders/all").hasRole("SUPERADMIN")
                .requestMatchers(HttpMethod.GET, "/api/orders/supplier").hasAnyRole("SUPPLIER", "SUPERADMIN")
                .requestMatchers(HttpMethod.PUT, "/api/orders/**").hasAnyRole("SUPPLIER", "SUPERADMIN")
                // SUPERADMIN only
                .requestMatchers("/api/admin/**").hasRole("SUPERADMIN")
                .anyRequest().authenticated()
            )
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:3000", "http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
