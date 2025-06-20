package com.vietcine.moviebooking_server.controller;

import com.vietcine.moviebooking_server.dto.request.BookingRequest;
import com.vietcine.moviebooking_server.dto.request.BookingSeatDTO;
import com.vietcine.moviebooking_server.dto.request.BookingUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.BookingResponse;
import com.vietcine.moviebooking_server.entity.*;
import com.vietcine.moviebooking_server.mapper.BookingMapper;
import com.vietcine.moviebooking_server.repository.*;
import com.vietcine.moviebooking_server.service.booking.BookingService;
import com.vietcine.moviebooking_server.service.mailer.EmailService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import static org.mockito.Mockito.doNothing;

import java.time.Instant;
import java.util.*;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

public class BookingPaymentWhiteBoxTest {
    @Mock
    private IBookingRepository bookingRepository;
    @Mock
    private IUserRepository userRepository;
    @Mock
    private IShowtimeRepository showtimeRepository;
    @Mock
    private IPaymentRepository paymentRepository;
    @Mock
    private ISeatRepository seatRepository;
    @Mock
    private IBookingSeatRepository bookingSeatRepository;
    @Mock
    private IBookingFoodRepository bookingFoodRepository;
    @Mock
    private IShowtimeSeatRepository showtimeSeatRepository;
    @Mock
    private BookingMapper bookingMapper;
    @Mock
    private EmailService emailService;

    @InjectMocks
    private BookingService bookingService;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
    }

    @Test
    void testCreateBooking_Success() {
        // Arrange
        BookingRequest req = new BookingRequest();
        req.setUser(1);
        req.setShowtime(2);
        req.setPayment(3);
        req.setTotal(100);
        req.setStatus("Pending");
        BookingSeatDTO seatDTO = new BookingSeatDTO();
        seatDTO.setSeat(4);
        req.setSeats(Set.of(seatDTO));
        User user = new User(); user.setId(1);
        Showtime showtime = new Showtime(); showtime.setId(2);
        Payment payment = new Payment(); payment.setId(3);
        Seat seat = new Seat(); seat.setId(4);
        Booking booking = new Booking(); booking.setId(10); booking.setUser(user); booking.setShowtime(showtime); booking.setPayment(payment); booking.setBookingSeats(new HashSet<>());
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
        when(showtimeRepository.findById(2)).thenReturn(Optional.of(showtime));
        when(paymentRepository.findById(3)).thenReturn(Optional.of(payment));
        when(seatRepository.findById(4)).thenReturn(Optional.of(seat));
        when(bookingRepository.save(any())).thenReturn(booking);
        when(bookingSeatRepository.saveAll(any())).thenReturn(List.of());
        when(bookingMapper.toBookingResponse(any())).thenReturn(new BookingResponse());
        ShowtimeSeat showtimeSeat = new ShowtimeSeat();
        when(showtimeSeatRepository.findByShowtimeIdAndSeatId(2, 4)).thenReturn(Optional.of(showtimeSeat));
        when(showtimeSeatRepository.save(any())).thenReturn(showtimeSeat);
        // Act
        BookingResponse res = bookingService.createBooking(req);
        // Assert
        assertNotNull(res);
    }

    @Test
    void testCreateBooking_PaymentNotFound_ShouldFail() {
        // Arrange
        BookingRequest req = new BookingRequest();
        req.setUser(1);
        req.setShowtime(2);
        req.setPayment(99); // payment không tồn tại
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        when(showtimeRepository.findById(2)).thenReturn(Optional.of(new Showtime()));
        when(paymentRepository.findById(99)).thenReturn(Optional.empty());
        // Act & Assert
        Exception ex = assertThrows(IllegalArgumentException.class, () -> bookingService.createBooking(req));
        assertTrue(ex.getMessage().contains("Payment not found"), "Nguyên nhân: payment không tồn tại");
    }

    @Test
    void testCreateBooking_SeatAlreadyBooked_ShouldFail() {
        // Arrange
        BookingRequest req = new BookingRequest();
        req.setUser(1);
        req.setShowtime(2);
        req.setPayment(3);
        BookingSeatDTO seatDTO = new BookingSeatDTO();
        seatDTO.setSeat(4);
        req.setSeats(Set.of(seatDTO));
        when(userRepository.findById(1L)).thenReturn(Optional.of(new User()));
        when(showtimeRepository.findById(2)).thenReturn(Optional.of(new Showtime()));
        when(paymentRepository.findById(3)).thenReturn(Optional.of(new Payment()));
        when(seatRepository.findById(4)).thenReturn(Optional.empty()); // seat không tồn tại/đã được đặt
        // Act & Assert
        Exception ex = assertThrows(IllegalArgumentException.class, () -> bookingService.createBooking(req));
        assertTrue(ex.getMessage().contains("Seat not found"), "Nguyên nhân: seat không tồn tại hoặc đã được đặt");
    }

    @Test
    void testUpdateBooking_Success() throws Exception {
        // Arrange
        BookingUpdateRequest updateReq = new BookingUpdateRequest();
        updateReq.setStatus("Success");
        Booking booking = new Booking();
        booking.setId(1);
        booking.setStatus("Pending");
        booking.setBookingSeats(new HashSet<>());
        booking.setShowtime(new Showtime());
        when(bookingRepository.findById(1)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any())).thenReturn(booking);
        when(bookingMapper.toBookingResponse(any())).thenReturn(new BookingResponse());
        doNothing().when(emailService).sendTicketConfirmationEmail(any());
        // Act
        BookingResponse res = bookingService.updateBooking(1, updateReq);
        // Assert
        assertNotNull(res);
    }

    @Test
    void testUpdateBooking_InvalidStatus_ShouldFail() {
        // Arrange
        BookingUpdateRequest updateReq = new BookingUpdateRequest();
        updateReq.setStatus("INVALID");
        Booking booking = new Booking();
        booking.setId(1);
        booking.setStatus("Pending");
        booking.setBookingSeats(new HashSet<>());
        booking.setShowtime(new Showtime());
        when(bookingRepository.findById(1)).thenReturn(Optional.of(booking));
        // Act & Assert
        Exception ex = assertThrows(IllegalArgumentException.class, () -> bookingService.updateBooking(1, updateReq));
        assertTrue(ex.getMessage().contains("Invalid status"), "Nguyên nhân: status không hợp lệ");
    }
} 