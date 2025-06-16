package com.vietcine.moviebooking_server.config;

import com.vietcine.moviebooking_server.security.AuthenticationFilter;
import com.vietcine.moviebooking_server.security.UserDetailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.ProviderManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration
public class SecurityConfig {

    @Autowired
    private AuthenticationFilter authFilter;

    @Bean
    public UserDetailsService userDetailsService() {
        return new UserDetailService();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        return http
                .csrf(AbstractHttpConfigurer::disable)
//                .addFilterBefore(authFilter, UsernamePasswordAuthenticationFilter.class) // Add Firebase authentication filter
//                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class) // Add custom filter
                .addFilterAfter(authFilter, UsernamePasswordAuthenticationFilter.class) // Add JWT authentication filter
                .authorizeHttpRequests(authorize -> authorize
                        .requestMatchers("/auth/**").permitAll()
                        .requestMatchers("/api/movies/**").permitAll()
                        .requestMatchers("/api/genres/**").permitAll()
                        .requestMatchers("/api/showtimes/**").permitAll()
                        .requestMatchers("/api/users/**").permitAll()
                        .requestMatchers("/api/seats/**").permitAll()
                        .requestMatchers("/api/seattypes/**").permitAll()
                        .requestMatchers("/api/seatprices/**").permitAll()
                        .requestMatchers("/api/theater-brands/**").permitAll()
                        .requestMatchers("/api/theaters/**").permitAll()
                        .requestMatchers("/api/food/**").permitAll()
                        .requestMatchers("/api/bookings/**").permitAll()
                        .requestMatchers("/api/vouchers/**").permitAll()
                        .requestMatchers("/api/vnpay-payment/**").permitAll()
                        .requestMatchers("/api/users/{userId}/password").authenticated()
                        .requestMatchers(
                                "/v3/api-docs/**",
                                "/swagger-ui/**",
                                "/swagger-ui.html"
                        ).permitAll()
                        .anyRequest().authenticated()
                )
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // No session
                .authenticationProvider(authenticationProvider()) // Use custom authentication provider
                .build();
    }

    @Bean
    public AuthenticationManager authenticationManager() {
        return new ProviderManager(authenticationProvider());
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService());
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}