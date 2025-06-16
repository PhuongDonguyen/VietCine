package com.vietcine.moviebooking_server.service.booking;

import com.vietcine.moviebooking_server.dto.request.BookingRequest;
import com.vietcine.moviebooking_server.dto.request.BookingUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.BookingDetailResponse;
import com.vietcine.moviebooking_server.dto.response.BookingHistoryResponse;
import com.vietcine.moviebooking_server.dto.response.BookingResponse;

import java.util.List;

public interface IBookingService {
    BookingResponse createBooking(BookingRequest bookingRequest);
    BookingResponse updateBooking(Integer id, BookingUpdateRequest updateRequest);
    List<BookingDetailResponse> getUserBookings(Integer userId);
    List<BookingHistoryResponse> getBookingHistorys(Integer userId);
    BookingDetailResponse getBookingById(Integer bookingId);
}
