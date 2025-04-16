package com.vietcine.moviebooking_server.service.seatType;

import com.vietcine.moviebooking_server.dto.response.SeatTypeWithPriceResponse;
import com.vietcine.moviebooking_server.entity.SeatType;
import org.hibernate.type.ListType;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.w3c.dom.stylesheets.LinkStyle;

import java.util.List;

public interface ISeatTypeService {
    List<SeatType> getAllSeatType();

    List<SeatTypeWithPriceResponse> getSeattypesWithPrice(int screenId);
}
