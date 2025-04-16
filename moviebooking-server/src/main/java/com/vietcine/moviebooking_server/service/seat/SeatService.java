package com.vietcine.moviebooking_server.service.seat;

import com.vietcine.moviebooking_server.dto.response.SeatResponse;
import com.vietcine.moviebooking_server.repository.SeatRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatService implements ISeatService {

    @Autowired
    private SeatRepository seatRepository;

    public List<SeatResponse> getSeatsByShowtime(int showtimeId) {
        List<Object[]> rawSeats = seatRepository.getSeatsByShowtimeRaw(showtimeId);

        return rawSeats.stream().map(row -> new SeatResponse(
                (int) row[0],              // SeatId
                (String) row[1],              // Row
                (int) row[2],               // Column
                row[3] != null ? (int) row[3] : null, // BookingId (nullable)
                (int) row[4],              // ShowtimeId
                (int) row[5],               // SeatTypeId
                (boolean) row[6]           // IsAvailable
        )).collect(Collectors.toList());
    }


}