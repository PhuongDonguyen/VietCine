package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingSeatResponse {
    private Integer id;
    private Integer bookingId;
    private String row;
    private Integer column;
} 