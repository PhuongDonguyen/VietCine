package com.vietcine.moviebooking_server.service.seatType;

import com.vietcine.moviebooking_server.dto.response.SeatResponse;
import com.vietcine.moviebooking_server.dto.response.SeatTypeResponse;
import com.vietcine.moviebooking_server.dto.response.SeatTypeWithPriceResponse;
import com.vietcine.moviebooking_server.entity.SeatType;
import com.vietcine.moviebooking_server.repository.ISeatTypeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class SeatTypeService implements ISeatTypeService {
    @Autowired
    private ISeatTypeRepository seatTypeRepository;

    @Override
    public List<SeatType> getAllSeatType() {
        return seatTypeRepository.findAll();
    }

    @Override
    public List<SeatTypeWithPriceResponse> getSeattypesWithPrice(int screenId) {
        List<Object[]> rawSeats = seatTypeRepository.getSeattypesWithPrice(screenId);

        return rawSeats.stream().map(row -> new SeatTypeWithPriceResponse(
                (int) row[0],              // SeatTypeId
                (String) row[1],              // TypeName
                (int) row[2],               // Price
                (int) row[3], // PriceIncrease
                (int) row[4]             // TotalPrice
        )).collect(Collectors.toList());
    }
}
