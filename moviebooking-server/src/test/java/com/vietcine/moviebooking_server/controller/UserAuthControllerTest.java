package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.request.SignupRequest;
import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.AuthenticationResponse;
import com.vietcine.moviebooking_server.dto.response.UserAuthenticationResponse;
import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.mapper.UserMapper;
import com.vietcine.moviebooking_server.service.user.UserService;
import com.vietcine.moviebooking_server.utils.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserAuthControllerTest {
    private static final Logger logger = LoggerFactory.getLogger(UserAuthControllerTest.class);

    @Mock
    private UserService userService;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private AuthenticationManager authenticationManager;

    @Mock
    private UserMapper userMapper;

    @InjectMocks
    private UserAuthController userAuthController;

    private SignupRequest validSignupRequest;
    private UserAuthenticationResponse mockUserResponse;

    @BeforeEach
    void setUp() {
        logger.info("Initializing test setup for UserAuthControllerTest");
        MockitoAnnotations.openMocks(this);

        // Setup valid signup request
        validSignupRequest = new SignupRequest();
        validSignupRequest.setFullName("Test User");
        validSignupRequest.setEmail("test@example.com");
        validSignupRequest.setPassword("password123");
        validSignupRequest.setRole("USER");
        logger.debug("Created valid signup request with email: {}", validSignupRequest.getEmail());

        // Setup mock user response
        mockUserResponse = new UserAuthenticationResponse();
        mockUserResponse.setId(125);
        mockUserResponse.setEmail("test@example.com");
        mockUserResponse.setFullName("Test User");
        mockUserResponse.setCreatedAt(Instant.now());
        mockUserResponse.setRole("USER");
        logger.debug("Created mock user response with ID: {}", mockUserResponse.getId());
    }

    @Test
    void signup_Success() {
        logger.info("Starting test: signup_Success");

        // Arrange
        logger.debug("Setting up mock behaviors for successful signup");
        when(userService.signupUser(any(SignupRequest.class))).thenReturn(mockUserResponse);
        when(jwtUtil.generateToken(anyString())).thenReturn("mocked.jwt.token");
        logger.debug("Mock setup complete");

        // Act
        logger.debug("Executing signup controller method");
        ResponseEntity<ApiResponse> response = userAuthController.signup(validSignupRequest);
        ApiResponse apiResponse = response.getBody();
        AuthenticationResponse authResponse = (AuthenticationResponse) apiResponse.getData();
        logger.debug("Received response with status: {}", response.getStatusCode());

        // Assert
        logger.debug("Beginning assertions");
        assertEquals(HttpStatus.OK, response.getStatusCode());
        assertTrue(apiResponse.getSuccess());
        assertEquals("User registered successfully", apiResponse.getMessage());
        assertEquals("mocked.jwt.token", authResponse.getToken());
        assertEquals(mockUserResponse, authResponse.getUser());
        assertEquals("USER", authResponse.getRole());
        logger.info("All assertions passed for successful signup test");

        // Verify methods were called
        logger.debug("Verifying method calls");
        verify(userService).signupUser(validSignupRequest);
        verify(jwtUtil).generateToken("test@example.com");
        logger.info("Method call verifications passed");
    }

    @Test
    void signup_DuplicateEmail() {
        logger.info("Starting test: signup_DuplicateEmail");

        // Arrange
        logger.debug("Setting up mock behavior for duplicate email scenario");
        when(userService.signupUser(any(SignupRequest.class)))
                .thenThrow(new DataIntegrityViolationException("Email đã đăng ký"));
        logger.debug("Mock setup complete");

        // Act & Assert
        logger.debug("Executing test and expecting DataIntegrityViolationException");
        Exception exception = assertThrows(DataIntegrityViolationException.class, () -> {
            userAuthController.signup(validSignupRequest);
        });

        logger.debug("Exception thrown with message: {}", exception.getMessage());
        assertEquals("Email đã đăng ký", exception.getMessage());

        // Verify interactions
        logger.debug("Verifying method calls");
        verify(userService).signupUser(validSignupRequest);
        verify(jwtUtil, never()).generateToken(anyString());
        logger.info("Method call verifications passed for duplicate email test");
    }
}