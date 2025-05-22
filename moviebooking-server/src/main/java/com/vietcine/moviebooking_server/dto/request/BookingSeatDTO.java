package com.vietcine.moviebooking_server.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

@Getter
@Setter
@ToString
public class BookingSeatDTO {
    @NotNull(message = "Seat ID is required")
    private Integer seat;
}