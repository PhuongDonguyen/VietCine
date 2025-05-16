package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.UserResponse;
import com.vietcine.moviebooking_server.service.user.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.Parameter;
import io.swagger.v3.oas.annotations.tags.Tag;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController // Changed from @Controller to @RestController
@RequestMapping("/api/users")
@Tag(name = "Users", description = "APIs for managing user profiles")
public class UserController {
    @Autowired
    private UserService userService;

    @GetMapping
    public ResponseEntity<?> getAllUser(){
        return ResponseEntity.ok(userService.getAllUser());
    }

    @GetMapping("/{id}")
    @Operation(summary = "Get user by ID", description = "Retrieves user details by their ID")
    public ResponseEntity<ApiResponse> getUserById(
            @Parameter(description = "ID of the user") @PathVariable Integer id) {
        try {
            UserResponse user = userService.getUserById(id);
            return ResponseEntity.ok(new ApiResponse("Success", true, user));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse("User not found: " + e.getMessage(), false, null)
            );
        }
    }

    @PutMapping(value = "/{id}", consumes = "multipart/form-data")
    @Operation(summary = "Update user", description = "Updates user details including avatar")
    public ResponseEntity<ApiResponse> updateUser(
            @Parameter(description = "ID of the user") @PathVariable Integer id,
            @Parameter(description = "Full name of the user") @RequestParam("fullName") String fullName,
            @Parameter(description = "Email of the user") @RequestParam("email") String email,
            @Parameter(description = "Phone number of the user") @RequestParam("phone") String phone,
            @Parameter(description = "Address of the user (optional)") @RequestParam(value = "address", required = false) String address,
            @Parameter(description = "Avatar image file (optional)") @RequestParam(value = "avatar", required = false) MultipartFile avatar) {
        try {
            UserResponse updatedUser = userService.updateUser(id, fullName, email, phone, address, avatar);
            return ResponseEntity.ok(new ApiResponse("Success", true, updatedUser));
        } catch (Exception e) {
            return ResponseEntity.status(400).body(
                    new ApiResponse("Failed to update user: " + e.getMessage(), false, null)
            );
        }
    }
}