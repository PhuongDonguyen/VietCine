package com.vietcine.moviebooking_server.service.user;

import com.vietcine.moviebooking_server.dto.request.SignupRequest;
import com.vietcine.moviebooking_server.dto.response.UserAuthenticationResponse;
import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.mapper.UserMapper;
import com.vietcine.moviebooking_server.repository.IUserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.Instant;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

class UserServiceTest {
    private static final Logger logger = LoggerFactory.getLogger(UserServiceTest.class);

    @Mock
    private IUserRepository userRepository;

    @Mock
    private UserMapper userMapper;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    private SignupRequest signupRequest;
    private User mockUser;
    private UserAuthenticationResponse mockAuthResponse;

    @BeforeEach
    void setUp() {
        logger.info("Initializing test setup for UserServiceTest");
        MockitoAnnotations.openMocks(this);

        // Setup test data
        signupRequest = new SignupRequest();
        signupRequest.setFullName("Test User");
        signupRequest.setEmail("phuongdonguyen03@gmail.com");
        signupRequest.setPassword("password123");
        signupRequest.setRole("USER");
        logger.debug("Created signup request with email: {}", signupRequest.getEmail());

        mockUser = new User();
        mockUser.setId(654);
        mockUser.setEmail("test@example.com");
        mockUser.setFullName("Test User");
        mockUser.setPasswordHash("encodedPassword");
        mockUser.setRole("USER");
        mockUser.setCreatedAt(Instant.now());
        logger.debug("Created mock user with ID: {}", mockUser.getId());

        mockAuthResponse = new UserAuthenticationResponse();
        mockAuthResponse.setId(29266);
        mockAuthResponse.setEmail("test@example.com");
        mockAuthResponse.setFullName("Test User");
        mockAuthResponse.setRole("USER");
        mockAuthResponse.setCreatedAt(mockUser.getCreatedAt());
        logger.debug("Created mock auth response with ID: {}", mockAuthResponse.getId());
    }

    @Test
    void signupUser_Success() {
        logger.info("Starting test: signupUser_Success");

        // Arrange
        logger.debug("Setting up mock behaviors for successful user signup");
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userMapper.toUser(any(SignupRequest.class))).thenReturn(mockUser);
        when(passwordEncoder.encode(anyString())).thenReturn("encodedPassword");
        when(userRepository.save(any(User.class))).thenReturn(mockUser);
        when(userMapper.toUserAuthenticationResponse(any(User.class))).thenReturn(mockAuthResponse);
        logger.debug("Mock setup complete");

        // Act
        logger.debug("Executing signupUser service method");
        UserAuthenticationResponse result = userService.signupUser(signupRequest);
        logger.debug("Received user authentication response");

        // Assert
        logger.debug("Beginning assertions");
        assertNotNull(result);
        assertEquals(mockAuthResponse.getEmail(), result.getEmail());
        assertEquals(mockAuthResponse.getFullName(), result.getFullName());
        assertEquals(mockAuthResponse.getRole(), result.getRole());
        logger.info("All assertions passed for successful signup test");

        // Verify interactions
        logger.debug("Verifying method calls");
        verify(userRepository).existsByEmail("test@example.com");
        verify(userMapper).toUser(signupRequest);
        verify(passwordEncoder).encode("password123");
        verify(userRepository).save(mockUser);
        verify(userMapper).toUserAuthenticationResponse(mockUser);
        logger.info("Method call verifications passed");
    }

    @Test
    void signupUser_EmailAlreadyExists() {
        logger.info("Starting test: signupUser_EmailAlreadyExists");

        // Arrange
        logger.debug("Setting up mock behavior for email already exists scenario");
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        logger.debug("Mock setup complete");

        // Act & Assert
        logger.debug("Executing test and expecting DataIntegrityViolationException");
        DataIntegrityViolationException exception = assertThrows(
                DataIntegrityViolationException.class,
                () -> userService.signupUser(signupRequest)
        );

        logger.debug("Exception thrown with message: {}", exception.getMessage());
        assertEquals("Email đã đăng ký", exception.getMessage());
        logger.info("Exception assertion passed");

        // Verify interactions
        logger.debug("Verifying method calls");
        verify(userRepository).existsByEmail("test@example.com");
//        verify(userMapper, never()).toUser(any());
        verify(passwordEncoder, never()).encode(any());
        verify(userRepository, never()).save(any());
        logger.info("Method call verifications passed for email already exists test");
    }

    @Test
    void findUserByEmail_Success() {
        logger.info("Starting test: findUserByEmail_Success");

        // Arrange
        logger.debug("Setting up mock behavior for finding user by email");
        when(userRepository.findByEmail(anyString())).thenReturn(java.util.Optional.of(mockUser));
        logger.debug("Mock setup complete");

        // Act
        logger.debug("Executing findUserByEmail service method");
        User result = userService.findUserByEmail("test@example.com");
        logger.debug("Received user response");

        // Assert
        logger.debug("Beginning assertions");
        assertNotNull(result);
        assertEquals(mockUser.getEmail(), result.getEmail());
        logger.info("All assertions passed for finding user by email test");

        // Verify
        logger.debug("Verifying method calls");
        verify(userRepository).findByEmail("test@example.com");
        logger.info("Method call verification passed");
    }

    @Test
    void findUserByEmail_UserNotFound() {
        logger.info("Starting test: findUserByEmail_UserNotFound");

        // Arrange
        logger.debug("Setting up mock behavior for user not found scenario");
        when(userRepository.findByEmail(anyString())).thenReturn(java.util.Optional.empty());
        logger.debug("Mock setup complete");

        // Act & Assert
        logger.debug("Executing test and expecting DataIntegrityViolationException");
        DataIntegrityViolationException exception = assertThrows(
                DataIntegrityViolationException.class,
                () -> userService.findUserByEmail("nonexistent@example.com")
        );

        logger.debug("Exception thrown with message: {}", exception.getMessage());
        assertEquals("User not found", exception.getMessage());
        logger.info("Exception assertion passed");

        // Verify
        logger.debug("Verifying method calls");
        verify(userRepository).findByEmail("nonexistent@example.com");
        logger.info("Method call verification passed for user not found test");
    }
}