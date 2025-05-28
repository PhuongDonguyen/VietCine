package com.vietcine.moviebooking_server.service.seatPrice;


import com.vietcine.moviebooking_server.dto.response.SeatPriceResponse;
import com.vietcine.moviebooking_server.repository.ISeatPriceRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatPriceService implements ISeatPriceService{
    @Autowired
    private ISeatPriceRepository seatPriceRepository;


    @Override
    public List<SeatPriceResponse> getSeatPriceOfScreen(int screenId) {
        List<Object[]> seatprices = seatPriceRepository.findByScreenId(screenId);
        return seatprices.stream().map(row -> new SeatPriceResponse(
                (int) row[0],
                (String) row [1],
                (int) row[2],
                (int) row[3],
                (int) row[4]
        )).collect(Collectors.toList());
    }
}
