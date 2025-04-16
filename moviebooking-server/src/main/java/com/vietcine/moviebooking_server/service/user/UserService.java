package com.vietcine.moviebooking_server.service.user;

import com.vietcine.moviebooking_server.dto.request.SignupRequest;
import com.vietcine.moviebooking_server.dto.response.UserAuthenticationResponse;
import com.vietcine.moviebooking_server.dto.response.UserResponse;
import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.mapper.UserMapper;
import com.vietcine.moviebooking_server.repository.IUserRepository;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.Date;
import java.util.List;

@Service
public class UserService {
    private final IUserRepository userRepository;
    private final UserMapper userMapper;
    private final PasswordEncoder passwordEncoder;


    public UserService(IUserRepository userRepository, UserMapper userMapper, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
        this.passwordEncoder = passwordEncoder;
    }

    public UserAuthenticationResponse signupUser(SignupRequest request) {
        Boolean exists = userRepository.existsByEmail(request.getEmail());
        if (exists) {
            throw new DataIntegrityViolationException("Email đã đăng ký");
        }
        User user = userMapper.toUser(request);
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setCreatedAt(new Date().toInstant());
        userRepository.save(user);
        return userMapper.toUserAuthenticationResponse(user);
    }

    public User findUserByEmail(String email) {
        return userRepository.findByEmail(email).orElseThrow(() -> new DataIntegrityViolationException("User not found"));
    }

    public User findByUid(String uid) {
        return userRepository.findByUid(uid).orElseThrow(() -> new DataIntegrityViolationException("User not found"));
    }

    public User createUser(User user) {
        return userRepository.save(user);
    }

    public User updateUser(User user) {
        return userRepository.save(user);
    }

    public UserResponse getUserById(Integer id) {
        User user = userRepository.findById(Long.valueOf(id)).orElseThrow(() -> new DataIntegrityViolationException("User not found"));
        return userMapper.toUserDTO(user);
    }

    public UserResponse updateUser(
            Integer id,
            String fullName,
            String email,
            String phone,
            String address,
            MultipartFile avatar) throws Exception {
        // Fetch the user
        User user = userRepository.findById(Long.valueOf(id))
                .orElseThrow(() -> new DataIntegrityViolationException("User not found"));

        // Validate required fields
        if (fullName == null || fullName.trim().isEmpty()) {
            throw new IllegalArgumentException("Full name is required");
        }
        if (email == null || email.trim().isEmpty()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (phone == null || phone.trim().isEmpty()) {
            throw new IllegalArgumentException("Phone is required");
        }

        // Validate email uniqueness (excluding the current user)
        if (!email.equals(user.getEmail()) && userRepository.existsByEmail(email)) {
            throw new DataIntegrityViolationException("Email đã được sử dụng bởi người dùng khác");
        }

        // Update user fields
        user.setFullName(fullName);
        user.setEmail(email);
        user.setPhone(phone);
        user.setAddress(address != null ? address : user.getAddress());

        // Handle avatar upload
        if (avatar != null && !avatar.isEmpty()) {
//            String avatarUrl = fileUploadService.uploadFile(avatar);
//            user.setAvatar(avatarUrl);
            System.out.println("Avatar uploaded: " + avatar.getOriginalFilename());
        }

        // Save the updated user
        User updatedUser = userRepository.save(user);
        return userMapper.toUserDTO(updatedUser);
    }

    public List<User> getAllUser() {
        return userRepository.findAll();
    }
}
