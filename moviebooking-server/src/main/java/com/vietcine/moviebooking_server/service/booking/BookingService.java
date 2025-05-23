package com.vietcine.moviebooking_server.service.booking;

import com.vietcine.moviebooking_server.dto.request.BookingFoodDTO;
import com.vietcine.moviebooking_server.dto.request.BookingRequest;
import com.vietcine.moviebooking_server.dto.request.BookingSeatDTO;
import com.vietcine.moviebooking_server.dto.request.BookingUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.BookingResponse;
import com.vietcine.moviebooking_server.entity.*;
import com.vietcine.moviebooking_server.mapper.BookingMapper;
import com.vietcine.moviebooking_server.repository.*;
import com.vietcine.moviebooking_server.service.mailer.EmailService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.LinkedHashSet;
import java.util.List;
import java.util.Set;

@Service
public class BookingService implements IBookingService {

    @Autowired
    private IBookingRepository bookingRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private IShowtimeRepository showtimeRepository;

    @Autowired
    private ISeatRepository seatRepository;

    @Autowired
    private IFoodRepository foodRepository;

    @Autowired
    private IBookingSeatRepository bookingSeatRepository;

    @Autowired
    private IBookingFoodRepository bookingFoodRepository;

    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private IShowtimeSeatRepository showtimeSeatRepository;

    @Autowired
    private EmailService emailService;

    @Autowired
    private BookingMapper bookingMapper;

    @Override
    @Transactional
    public BookingResponse createBooking(BookingRequest bookingRequest) {
        // Validate User
        User user = userRepository.findById(Long.valueOf(bookingRequest.getUser()))
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + bookingRequest.getUser()));

        // Validate Showtime
        Showtime showtime = showtimeRepository.findById(bookingRequest.getShowtime())
                .orElseThrow(() -> new IllegalArgumentException("Showtime not found with ID: " + bookingRequest.getShowtime()));

        // Validate Payment
        Payment payment = paymentRepository.findById(bookingRequest.getPayment())
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + bookingRequest.getPayment()));

        // Create new Booking
        Booking newBooking = Booking.builder()
                .user(user)
                .showtime(showtime)
                .bookingDate(Instant.now())
                .total(bookingRequest.getTotal())
                .status(bookingRequest.getStatus())
                .discount(bookingRequest.getDiscount() != null ? bookingRequest.getDiscount() : 0)
                .payment(payment)
                .isActive(true)
                .vnpTxnRef(bookingRequest.getVnpTxnRef())
                .voucherUserId(bookingRequest.getVoucherUserId())
                .bookingFoods(new LinkedHashSet<>())
                .bookingSeats(new LinkedHashSet<>())
                .build();

        // Save the booking first to generate its ID
        newBooking = bookingRepository.save(newBooking);

        // Handle seats
        Set<BookingSeat> bookingSeats = new LinkedHashSet<>();
        for (BookingSeatDTO seatDTO : bookingRequest.getSeats()) {
            Seat seat = seatRepository.findById(seatDTO.getSeat())
                    .orElseThrow(() -> new IllegalArgumentException("Seat not found with ID: " + seatDTO.getSeat()));

            BookingSeat bookingSeat = BookingSeat.builder()
                    .booking(newBooking)
                    .seat(seat)
                    .build();
            bookingSeats.add(bookingSeat);

            // Update ShowtimeSeat status to 'pending'
            updateShowtimeSeatStatus(showtime.getId(), seat.getId(), "pending");
        }
        List<BookingSeat> savedSeats = bookingSeatRepository.saveAll(bookingSeats);
        newBooking.setBookingSeats(new LinkedHashSet<>(savedSeats));

        // Handle foods
        Set<BookingFood> bookingFoods = new LinkedHashSet<>();
        if (bookingRequest.getFoods() != null && !bookingRequest.getFoods().isEmpty()) {
            for (BookingFoodDTO foodDTO : bookingRequest.getFoods()) {
                Food food = foodRepository.findById(foodDTO.getFoodId())
                        .orElseThrow(() -> new IllegalArgumentException("Food not found with ID: " + foodDTO.getFoodId()));

                BookingFood bookingFood = BookingFood.builder()
                        .booking(newBooking)
                        .food(food)
                        .quantity(foodDTO.getQuantity())
                        .total(foodDTO.getTotal())
                        .build();
                bookingFoods.add(bookingFood);
            }
            List<BookingFood> savedFoods = bookingFoodRepository.saveAll(bookingFoods);
            newBooking.setBookingFoods(new LinkedHashSet<>(savedFoods));
        }

        // Save the booking again to update relationships
        newBooking = bookingRepository.save(newBooking);

        // Map to BookingResponse using MapStruct
        return bookingMapper.toBookingResponse(newBooking);
    }

    @Transactional
    public BookingResponse updateBooking(Integer id, BookingUpdateRequest updateRequest) {
        // Find existing booking
        Booking booking = bookingRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + id));

        // Update fields based on status
        if (updateRequest.getVnpTxnRef() != null) {
            booking.setVnpTxnRef(updateRequest.getVnpTxnRef());
        }

        String newStatus;
        if ("Success".equalsIgnoreCase(updateRequest.getStatus())) {
            booking.setStatus("Success");
            booking.setIsActive(true);
            newStatus = "booked";
        } else if ("Failed".equalsIgnoreCase(updateRequest.getStatus())) {
            booking.setStatus("Failed");
            booking.setIsActive(false);
            newStatus = "available";
        } else {
            throw new IllegalArgumentException("Invalid status: " + updateRequest.getStatus() + ". Must be 'Success' or 'Failed'.");
        }

        // Update ShowtimeSeat status for all seats in this booking
        for (BookingSeat bookingSeat : booking.getBookingSeats()) {
            updateShowtimeSeatStatus(booking.getShowtime().getId(), bookingSeat.getSeat().getId(), newStatus);
        }

        // Save updated booking
        Booking updatedBooking = bookingRepository.save(booking);

        // Send email if booking status is successful
        if ("Success".equalsIgnoreCase(updateRequest.getStatus())) {
            try {
                emailService.sendTicketConfirmationEmail(updatedBooking.getId());
                System.out.println("Ticket confirmation email sent successfully for booking ID: " + updatedBooking.getId());
            } catch (Exception e) {
                // Log the error but don't fail the booking update
                System.err.println("Failed to send confirmation email for booking ID: " + updatedBooking.getId() + ". Error: " + e.getMessage());
                e.printStackTrace();
            }
        }

        // Map to BookingResponse using MapStruct
        return bookingMapper.toBookingResponse(updatedBooking);
    }

    /**
     * Helper method to update ShowtimeSeat status
     * @param showtimeId The showtime ID
     * @param seatId The seat ID
     * @param status The new status to set
     */
    private void updateShowtimeSeatStatus(Integer showtimeId, Integer seatId, String status) {
        ShowtimeSeat showtimeSeat = showtimeSeatRepository.findByShowtimeIdAndSeatId(showtimeId, seatId)
                .orElseThrow(() -> new IllegalArgumentException(
                        "ShowtimeSeat not found for Showtime ID: " + showtimeId + " and Seat ID: " + seatId));

        showtimeSeat.setStatus(status);
        showtimeSeatRepository.save(showtimeSeat);
    }
}