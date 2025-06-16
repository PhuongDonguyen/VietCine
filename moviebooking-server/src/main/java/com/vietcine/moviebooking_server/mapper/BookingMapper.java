package com.vietcine.moviebooking_server.mapper;

import com.vietcine.moviebooking_server.dto.response.*;
import com.vietcine.moviebooking_server.entity.*;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.Set;

@Mapper(componentModel = "spring")
public interface BookingMapper {
    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "payment.id", target = "paymentId")
    BookingResponse toBookingResponse(Booking booking);

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "payment.id", target = "paymentId")
    @Mapping(source = "bookingSeats", target = "bookingSeats")
    @Mapping(source = "bookingFoods", target = "bookingFoods")
    @Mapping(source = "voucherUserId", target = "voucherUserId")
    BookingDetailResponse toBookingDetailResponse(Booking booking);

    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "food.foodName", target = "foodName")
    BookingFoodResponse toBookingFoodResponse(BookingFood bookingFood);

    @Mapping(source = "booking.id", target = "bookingId")
    @Mapping(source = "seat.row", target = "row")
    @Mapping(source = "seat.column", target = "column")
    BookingSeatResponse toBookingSeatResponse(BookingSeat bookingSeat);

    @Mapping(source = "theaterBrand.id", target = "theaterBrandId")
    VoucherResponse toVoucherResponse(Voucher voucher);

    Set<BookingSeatResponse> toBookingSeatResponseSet(Set<BookingSeat> bookingSeats);
    Set<BookingFoodResponse> toBookingFoodResponseSet(Set<BookingFood> bookingFoods);
}