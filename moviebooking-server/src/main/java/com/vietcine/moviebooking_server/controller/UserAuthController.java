package com.vietcine.moviebooking_server.controller;

import com.google.firebase.auth.FirebaseAuth;
import com.google.firebase.auth.FirebaseToken;
import com.vietcine.moviebooking_server.dto.request.LoginRequest;
import com.vietcine.moviebooking_server.dto.request.SignupRequest;
import com.vietcine.moviebooking_server.dto.request.UserOAuthRequest;
import com.vietcine.moviebooking_server.dto.response.APIResponse;
import com.vietcine.moviebooking_server.dto.response.AuthenticationResponse;
import com.vietcine.moviebooking_server.dto.response.UserAuthenticationResponse;
import com.vietcine.moviebooking_server.entity.User;
import com.vietcine.moviebooking_server.mapper.UserMapper;
import com.vietcine.moviebooking_server.security.UserDetailService;
import com.vietcine.moviebooking_server.service.user.UserService;
import com.vietcine.moviebooking_server.utils.JwtUtil;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.Date;

@RestController // Changed from @Controller to @RestController
@RequestMapping("/auth")
@Tag(name = "Authentication", description = "APIs for user authentication")
public class UserAuthController {
    @Autowired
    private UserService userService;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserDetailService userDetailsService;

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/signup")
    @Operation(summary = "Sign up a new user", description = "Registers a new user with email and password")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "User registered successfully"),
            @ApiResponse(responseCode = "400", description = "Invalid request data")
    })
    public ResponseEntity<APIResponse> signup(@RequestBody @Valid SignupRequest newUser) {
        UserAuthenticationResponse user = userService.signupUser(newUser);
        String token = jwtUtil.generateToken(newUser.getEmail());
        return ResponseEntity.ok(new APIResponse(
                "User registered successfully",
                true,
                new AuthenticationResponse(token, user, user.getRole())
        ));
    }

    @PostMapping("/google")
    @Operation(summary = "Google OAuth login", description = "Authenticates a user using Google OAuth")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "500", description = "Internal server error")
    })
    public ResponseEntity<APIResponse> googleLogin(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody UserOAuthRequest userOAuthRequest) {
        try {
            if (authorizationHeader == null || !authorizationHeader.startsWith("Bearer ")) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new APIResponse("Missing or invalid Authorization header", false));
            }

            String idToken = authorizationHeader.substring(7);
            FirebaseToken decodedToken = FirebaseAuth.getInstance().verifyIdToken(idToken);
            if (decodedToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(new APIResponse("Authentication failed", false));
            }

            String uid = decodedToken.getUid();
            String email = decodedToken.getEmail();

            User user = null;

            try {
                user = userService.findUserByEmail(email);
            } catch (DataIntegrityViolationException ex) {
                // User not found, continue with user creation
            }

            if (user == null) {
                user = userMapper.toUser(userOAuthRequest);
                user.setCreatedAt(new Date().toInstant());
                user = userService.createUser(user);
            } else {
                if (user.getUid() == null) {
                    user.setUid(uid);
                    user.setProviderId(userOAuthRequest.getProviderId());
                    user.setAvatar(userOAuthRequest.getAvatar());
                    user.setIdToken(userOAuthRequest.getIdToken());
                    userService.updateUser(user);
                }
            }

            System.out.println(user.getEmail());

            return ResponseEntity.ok(new APIResponse(
                    "Login successful",
                    true,
                    new AuthenticationResponse(
                            jwtUtil.generateToken(user.getEmail()),
                            new UserAuthenticationResponse(user.getId(), user.getUid(), user.getEmail(), user.getFullName(), user.getCreatedAt(), user.getAvatar(), user.getRole()),
                            user.getRole()
                    )
            ));

        } catch (Exception e) {
            System.out.println("Error during Google login: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(new APIResponse("An error occurred", false));
        }
    }

    @PostMapping("/login")
    @Operation(summary = "User login", description = "Authenticates a user with email and password (used for both user and admin)")
    @ApiResponses({
            @ApiResponse(responseCode = "200", description = "Login successful"),
            @ApiResponse(responseCode = "401", description = "Invalid credentials")
    })
    public ResponseEntity<APIResponse> login(@RequestBody @Valid LoginRequest loginRequest) {
        try {
            authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getPassword())
            );
            UserDetails userDetails = userDetailsService.loadUserByUsername(loginRequest.getEmail());
            String token = jwtUtil.generateToken(userDetails.getUsername());
            User user = userService.findUserByEmail(loginRequest.getEmail());
            return ResponseEntity.ok(new APIResponse(
                    "Login successful",
                    true,
                    new AuthenticationResponse(token, new UserAuthenticationResponse(user.getId(), user.getUid(), user.getEmail(), user.getFullName(), user.getCreatedAt(), user.getAvatar(), user.getRole()), userDetails.getAuthorities().toArray()[0].toString())
            ));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(401).body(new APIResponse("Email hoặc mật khẩu không chính xác", null));
        }
    }
}