package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.*;
import lombok.*;

import java.util.Set;

@Getter
@Setter
@ToString
public class BookingRequest {
    @NotNull(message = "User ID is required")
    private Integer user;

    @NotNull(message = "Showtime ID is required")
    private Integer showtime;

    @NotNull(message = "Total amount is required")
    private Integer total;

    private String status = "Pending";

    @PositiveOrZero(message = "Discount must be zero or positive")
    private Integer discount;

    @NotNull(message = "Payment ID is required")
    private Integer payment;

    @Size(max = 200, message = "VNP transaction reference must not exceed 200 characters")
    private String vnpTxnRef;

    private Integer voucherUserId;

    @NotEmpty(message = "At least one seat must be selected")
    private Set<BookingSeatDTO> seats;

    private Set<BookingFoodDTO> foods;
}