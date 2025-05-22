package com.vietcine.moviebooking_server.dto.request;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookingUpdateRequest {
    @Size(max = 200, message = "VNP transaction reference must not exceed 200 characters")
    private String vnpTxnRef;

    @NotBlank(message = "Status is required")
    @Size(max = 100, message = "Status must not exceed 100 characters")
    private String status;
}