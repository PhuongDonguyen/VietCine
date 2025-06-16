package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data
public class FoodOrderUpdateRequest {
    @NotBlank(message = "VNP transaction reference is required")
    private String vnpTxnRef;

    @NotBlank(message = "Status is required")
    private String status;
}
