package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.*;

@Getter
@Setter
@ToString
public class BookingFoodDTO {
    @NotNull(message = "Food ID is required")
    private Integer foodId;

    @NotNull(message = "Quantity is required")
    @Positive(message = "Quantity must be positive")
    private Integer quantity;

    @NotNull(message = "Total is required")
    @PositiveOrZero(message = "Total must be zero or positive")
    private Integer total;
}