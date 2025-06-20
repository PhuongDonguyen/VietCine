package com.vietcine.moviebooking_server.controller;

import com.cloudinary.Cloudinary;
import com.cloudinary.Uploader;
import com.vietcine.moviebooking_server.dto.request.UpdatePasswordRequest;
import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.UserResponse;
import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.mapper.UserMapper;
import com.vietcine.moviebooking_server.repository.IUserRepository;
import com.vietcine.moviebooking_server.service.user.UserService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.ResponseEntity;
import org.springframework.mock.web.MockMultipartFile;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.HashMap;
import java.util.Map;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class UserWhiteBoxTest {
    @Mock
    private IUserRepository userRepository;
    @Mock
    private UserMapper userMapper;
    @Mock
    private PasswordEncoder passwordEncoder;
    @Mock
    private Cloudinary cloudinary;
    @Mock
    private Uploader uploader;
    @InjectMocks
    private UserService userService;
    private UserController userController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        userController = new UserController();
        // Inject UserService vào UserController (giả lập @Autowired)
        java.lang.reflect.Field field;
        try {
            field = UserController.class.getDeclaredField("userService");
            field.setAccessible(true);
            field.set(userController, userService);
        } catch (Exception e) {
            throw new RuntimeException(e);
        }
        when(cloudinary.uploader()).thenReturn(uploader);
    }

    // --- Test getUserById ---
    @Test
    void testGetUserById_Success() {
        User user = new User(); user.setId(1); user.setEmail("a@a.com");
        UserResponse userResponse = new UserResponse();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userMapper.toUserDTO(user)).thenReturn(userResponse);

        ResponseEntity<ApiResponse> response = userController.getUserById(1);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().getSuccess());
    }
    @Test
    void testGetUserById_NotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        ResponseEntity<ApiResponse> response = userController.getUserById(1);
        assertEquals(404, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
        assertTrue(response.getBody().getMessage().contains("User not found"));
    }

    // --- Test updateUser ---
    @Test
    void testUpdateUser_Success() throws Exception {
        User user = new User(); user.setId(1); user.setEmail("a@a.com");
        UserResponse userResponse = new UserResponse();
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(anyString())).thenReturn(false);
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(userMapper.toUserDTO(any(User.class))).thenReturn(userResponse);
        MockMultipartFile avatar = new MockMultipartFile("avatar", "avatar.png", "image/png", "dummy".getBytes());
        Map<String, Object> uploadResult = new HashMap<>();
        uploadResult.put("secure_url", "http://mocked.url/avatar.jpg");
        when(uploader.upload(any(byte[].class), any(Map.class))).thenReturn(uploadResult);

        ResponseEntity<ApiResponse> response = userController.updateUser(1, "Test", "test@email.com", "0123", "Addr", avatar);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().getSuccess());
    }
    @Test
    void testUpdateUser_Fail_EmptyFullName() throws Exception {
        User user = new User(); user.setId(1); user.setEmail("a@a.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        MockMultipartFile avatar = new MockMultipartFile("avatar", "avatar.png", "image/png", "dummy".getBytes());
        ResponseEntity<ApiResponse> response = userController.updateUser(1, "", "test@email.com", "0123", "Addr", avatar);
        assertEquals(400, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
        assertTrue(response.getBody().getMessage().contains("Full name is required"));
    }
    @Test
    void testUpdateUser_Fail_EmailExists() throws Exception {
        User user = new User(); user.setId(1); user.setEmail("old@email.com");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(userRepository.existsByEmail(anyString())).thenReturn(true);
        MockMultipartFile avatar = new MockMultipartFile("avatar", "avatar.png", "image/png", "dummy".getBytes());
        ResponseEntity<ApiResponse> response = userController.updateUser(1, "Test", "new@email.com", "0123", "Addr", avatar);
        assertEquals(400, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
        assertTrue(response.getBody().getMessage().contains("Email đã được sử dụng"));
    }

    @Test
    void testUpdateUser_EmailAlreadyExists_ShouldFail() throws Exception {
        // Arrange
        User user = new User();
        user.setId(1);
        user.setEmail("old@email.com");
        user.setFullName("Test");
        user.setPhone("0123");
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(userRepository.existsByEmail("new@email.com")).thenReturn(true);

        // Act & Assert
        Exception ex = assertThrows(DataIntegrityViolationException.class, () -> {
            userService.updateUser(1, "Test", "new@email.com", "0123", "Addr", null);
        });
        assertTrue(ex.getMessage().contains("Email đã được sử dụng"));
    }


    // --- Test updateUserPassword ---
    @Test
    void testUpdateUserPassword_Success() {
        User user = new User(); user.setId(1); user.setPasswordHash("hash");
        UpdatePasswordRequest req = new UpdatePasswordRequest();
        req.setOldPassword("old"); req.setNewPassword("new");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("old", "hash")).thenReturn(true);
        when(passwordEncoder.encode("new")).thenReturn("newHash");
        when(userRepository.save(any(User.class))).thenReturn(user);
        ResponseEntity<ApiResponse> response = userController.updateUserPassword(1L, req);
        assertEquals(200, response.getStatusCodeValue());
        assertTrue(response.getBody().getSuccess());
    }
    @Test
    void testUpdateUserPassword_Fail_WrongOldPassword() {
        User user = new User(); user.setId(1); user.setPasswordHash("hash");
        UpdatePasswordRequest req = new UpdatePasswordRequest();
        req.setOldPassword("wrong"); req.setNewPassword("new");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(passwordEncoder.matches("wrong", "hash")).thenReturn(false);
        ResponseEntity<ApiResponse> response = userController.updateUserPassword(1L, req);
        assertEquals(400, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
        assertTrue(response.getBody().getMessage().contains("Mật khẩu cũ không chính xác"));
    }
    @Test
    void testUpdateUserPassword_WrongOldPassword_ShouldFail() {
        // Arrange
        User user = new User();
        user.setId(1);
        user.setPasswordHash("encoded-old");
        when(userRepository.findById(1L)).thenReturn(java.util.Optional.of(user));
        when(passwordEncoder.matches(anyString(), anyString())).thenReturn(false);
        UpdatePasswordRequest req = new UpdatePasswordRequest();
        req.setOldPassword("wrong");
        req.setNewPassword("new");

        // Act & Assert
        Exception ex = assertThrows(IllegalArgumentException.class, () -> {
            userService.updateUserPassword(1L, req);
        });
        assertTrue(ex.getMessage().contains("Mật khẩu cũ không chính xác"));
    }
    @Test
    void testUpdateUserPassword_Fail_UserNotFound() {
        UpdatePasswordRequest req = new UpdatePasswordRequest();
        when(userRepository.findById(1L)).thenReturn(Optional.empty());
        ResponseEntity<ApiResponse> response = userController.updateUserPassword(1L, req);
        assertEquals(400, response.getStatusCodeValue());
        assertFalse(response.getBody().getSuccess());
        assertTrue(response.getBody().getMessage().contains("Không tìm thấy người dùng"));
    }

    @Test
    void testGetUserById_NotFound_ShouldFail() {
        // Arrange
        when(userRepository.findById(99L)).thenReturn(java.util.Optional.empty());
        // Act & Assert
        Exception ex = assertThrows(DataIntegrityViolationException.class, () -> {
            userService.getUserById(99);
        });
        assertTrue(ex.getMessage().contains("User not found"));
    }
} 