package com.vietcine.moviebooking_server.service.mailer;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import com.vietcine.moviebooking_server.entity.Booking;
import com.vietcine.moviebooking_server.entity.BookingFood;
import com.vietcine.moviebooking_server.entity.BookingSeat;
import com.vietcine.moviebooking_server.repository.IBookingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.NumberFormat;
import java.time.format.DateTimeFormatter;
import java.util.Locale;
import java.util.stream.Collectors;

@Service
public class EmailService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private TemplateEngine templateEngine;

    @Autowired
    private IBookingRepository bookingRepository;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendTicketConfirmationEmail(Integer bookingId) throws MessagingException, IOException, WriterException {
        // Fetch booking details
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new IllegalArgumentException("Booking not found with ID: " + bookingId));

        // Only send email for successful bookings
        if (!"Success".equalsIgnoreCase(booking.getStatus())) {
            throw new IllegalStateException("Cannot send confirmation email for booking with status: " + booking.getStatus());
        }

        // Generate QR code
        byte[] qrCodeImage = generateQRCode(booking);

        // Create email
        MimeMessage message = mailSender.createMimeMessage();
        MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

        // Email details
        helper.setFrom(fromEmail);
        helper.setTo(booking.getUser().getEmail());
        helper.setSubject("Xác nhận vé xem phim - VietCine");

        // Create HTML content using Thymeleaf template
        Context context = new Context();
        context.setVariable("customerName", booking.getUser().getFullName());
        context.setVariable("bookingId", booking.getId());
        context.setVariable("movieTitle", booking.getShowtime().getMovie().getTitle());
        context.setVariable("showDate", booking.getShowtime().getStartTime());
        context.setVariable("showTime", booking.getShowtime().getStartTime());
        context.setVariable("theaterName", booking.getShowtime().getScreen().getTheater().getName());
        context.setVariable("screenNumber", booking.getShowtime().getScreen().getScreenNumber());
        context.setVariable("seats", booking.getBookingSeats().stream()
                .map(BookingSeat::getSeat)
                .map(seat -> seat.getRow() + seat.getColumn())
                .collect(Collectors.joining(", ")));
        context.setVariable("foods", booking.getBookingFoods().stream()
                .map(bf -> bf.getFood().getFoodName() + " x" + bf.getQuantity())
                .collect(Collectors.joining(", ")));
        context.setVariable("totalAmount", formatCurrency(booking.getTotal()));
        context.setVariable("status", booking.getStatus());
        context.setVariable("vnpTxnRef", booking.getVnpTxnRef());
        context.setVariable("qrCodeUrl", "cid:qrcode");

        String htmlContent = templateEngine.process("ticket-confirmation", context);
        helper.setText(htmlContent, true);

        // Attach QR code
        helper.addInline("qrcode", new ByteArrayResource(qrCodeImage), "image/png");

        // Send email
        mailSender.send(message);
    }

    private byte[] generateQRCode(Booking booking) throws WriterException, IOException {
        // Create QR code content with booking information
        String qrContent = String.format(
                "VIETCINE TICKET\nBooking ID: %d\nMovie: %s\nDate: %s\nTime: %s\nTheater: %s\nScreen: %s\nSeats: %s\nStatus: %s\nTransaction Ref: %s",
                booking.getId(),
                booking.getShowtime().getMovie().getTitle(),
                booking.getShowtime().getStartTime(),
                booking.getShowtime().getStartTime(),
                booking.getShowtime().getScreen().getTheater().getName(),
                booking.getShowtime().getScreen().getScreenNumber(),
                booking.getBookingSeats().stream()
                        .map(BookingSeat::getSeat)
                        .map(seat -> seat.getRow() + seat.getColumn())
                        .collect(Collectors.joining(", ")),
                booking.getStatus(),
                booking.getVnpTxnRef()
        );

        QRCodeWriter qrCodeWriter = new QRCodeWriter();
        BitMatrix bitMatrix = qrCodeWriter.encode(qrContent, BarcodeFormat.QR_CODE, 300, 300);

        ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
        MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);
        return outputStream.toByteArray();
    }

    private String formatCurrency(Integer amount) {
        NumberFormat formatter = NumberFormat.getCurrencyInstance(new Locale("vi", "VN"));
        return formatter.format(amount).replace("₫", "đ");
    }
}