package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.response.ApiResponse;
import com.vietcine.moviebooking_server.dto.response.VoucherUserResponse;
import com.vietcine.moviebooking_server.service.voucher.IVoucherUserService;
import com.vietcine.moviebooking_server.service.voucher.VoucherUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/vouchers")
public class VoucherUserController {
    @Autowired
    private IVoucherUserService voucherUserService;

    @GetMapping("/active")
    public ResponseEntity<ApiResponse> getActiveVouchersForUser(
            @RequestParam Integer userId,
            @RequestParam Integer theaterBrandId) {
        try {
            return ResponseEntity.ok(new ApiResponse("Get active vouchers successfully", true,
                    voucherUserService.getActiveVouchersForUser(userId, theaterBrandId)));
        } catch (Exception e) {
            return ResponseEntity.status(404).body(
                    new ApiResponse("Error retrieving vouchers: " + e.getMessage(), false, null)
            );
        }
    }
}