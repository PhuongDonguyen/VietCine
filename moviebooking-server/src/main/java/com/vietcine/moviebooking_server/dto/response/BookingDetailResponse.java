package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.Movie;
import lombok.*;

import java.time.Instant;
import java.util.Set;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BookingDetailResponse {
    private Integer id;
    private Integer userId;
    private ShowtimeResponse showtime;
    private MovieResponse movie;
    private Instant bookingDate;
    private Integer total;
    private String status;
    private Integer discount;
    private Integer paymentId;
    private Boolean isActive;
    private String vnpTxnRef;
    private Integer voucherUserId;
    private Set<BookingSeatResponse> bookingSeats;
    private Set<BookingFoodResponse> bookingFoods;
    private VoucherResponse voucher;
} 