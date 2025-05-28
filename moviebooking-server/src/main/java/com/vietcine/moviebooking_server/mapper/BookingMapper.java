package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.BookingResponse;
import com.vietcine.moviebooking_server.entity.Booking;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "showtime.id", target = "showtimeId")
    @Mapping(source = "payment.id", target = "paymentId")
    BookingResponse toBookingResponse(Booking booking);
}