package com.vietcine.moviebooking_server.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseAuthException;
import com.google.firebase.auth.FirebaseToken;
import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.repository.IUserRepository;
import com.vietcine.moviebooking_server.utils.JwtUtil;
import io.jsonwebtoken.MalformedJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class AuthenticationFilter extends OncePerRequestFilter {
    private static final Logger logger = LoggerFactory.getLogger(AuthenticationFilter.class);

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private FirebaseAuth firebaseAuth;

    @Autowired
    private UserDetailService userDetailsService; // Note: Assuming this is your UserDetailsService implementation

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ObjectMapper objectMapper; // For JSON response serialization

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        String authHeader = request.getHeader("Authorization");
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String token = authHeader.substring(7);

            // Try Firebase authentication first
            try {
                FirebaseToken decodedToken = firebaseAuth.verifyIdToken(token);
                String email = decodedToken.getEmail();
                UserDetails userDetails = loadOrCreateUser(email, response);
                if (userDetails != null) {
                    setAuthentication(userDetails, request);
                    request.setAttribute("firebaseUser", decodedToken); // Preserve Firebase token info if needed
                }
            } catch (FirebaseAuthException e) {
                logger.debug("Not a Firebase token: {}", e.getMessage());
                // Try custom JWT authentication
                try {
                    String email = jwtUtil.extractEmail(token);
                    if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                        UserDetails userDetails = loadUser(email, response);
                        if (userDetails != null && jwtUtil.validateToken(token, email)) {
                            setAuthentication(userDetails, request);
                        }
                    }
                } catch (MalformedJwtException malformedJwtException) {
                    logger.warn("Invalid JWT token: {}", malformedJwtException.getMessage());
                    sendErrorResponse(response, "Invalid or expired token: " + malformedJwtException.getMessage());
                    return;
                }
            }
        }
        filterChain.doFilter(request, response);
    }

    private UserDetails loadOrCreateUser(String email, HttpServletResponse response) throws IOException {
        try {
            return userDetailsService.loadUserByUsername(email);
        } catch (Exception e) {
            logger.info("User not found, auto-creating for Firebase: {}", email);
            // Auto-create user for Firebase/Google OAuth
            User newUser = new User();
            newUser.setEmail(email);
            newUser.setRole("USER");
            userRepository.save(newUser);
            return org.springframework.security.core.userdetails.User.builder()
                    .username(email)
                    .password("{noop}firebase")
                    .roles("USER")
                    .build();
        }
    }

    private UserDetails loadUser(String email, HttpServletResponse response) throws IOException {
        try {
            return userDetailsService.loadUserByUsername(email);
        } catch (Exception e) {
            logger.warn("User not found for JWT: {}", email);
            sendErrorResponse(response, "User not found: " + email);
            return null;
        }
    }

    private void setAuthentication(UserDetails userDetails, HttpServletRequest request) {
        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());
        authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
        SecurityContextHolder.getContext().setAuthentication(authentication);
    }

    private void sendErrorResponse(HttpServletResponse response, String message) throws IOException {
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.getWriter().write(objectMapper.writeValueAsString(new APIResponse(message, false)));
    }

//    @Override
//    protected boolean shouldNotFilter(HttpServletRequest request) {
//        String path = request.getRequestURI();
//        return path.startsWith("/api/public/") ||
//                path.startsWith("/auth/"); // Covers /auth/login, /auth/register, etc.
//    }
}