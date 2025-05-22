package com.vietcine.moviebooking_server.service.booking;

import com.vietcine.moviebooking_server.dto.request.BookingRequest;
import com.vietcine.moviebooking_server.dto.request.BookingUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.BookingResponse;

public interface IBookingService {
    BookingResponse createBooking(BookingRequest bookingRequest);
    BookingResponse updateBooking(Integer id, BookingUpdateRequest updateRequest);
}
