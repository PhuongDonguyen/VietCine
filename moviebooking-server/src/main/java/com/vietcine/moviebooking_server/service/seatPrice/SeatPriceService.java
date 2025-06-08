package com.vietcine.moviebooking_server.service.seatPrice;

import com.vietcine.moviebooking_server.dto.response.SeatPriceResponse;
import com.vietcine.moviebooking_server.repository.ISeatPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatPriceService implements ISeatPriceService {
    @Autowired
    private ISeatPriceRepository seatPriceRepository;

    @Override
    public List<SeatPriceResponse> getSeatPriceOfScreen(int screenId, LocalDate bookingDate) {
        List<Object[]> seatPrices = seatPriceRepository.findByScreenIdAndBookingDate(screenId, bookingDate);
        return seatPrices.stream().map(row -> new SeatPriceResponse(
                (int) row[0],    // SeatTypeId
                (String) row[1], // TypeName
                (int) row[2],    // Price
                (int) row[3],    // PriceIncrease
                (int) row[4]     // TotalPrice
        )).collect(Collectors.toList());
    }
}