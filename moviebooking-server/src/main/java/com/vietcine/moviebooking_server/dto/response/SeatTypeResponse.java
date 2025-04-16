package com.vietcine.moviebooking_server.dto.response;

import com.vietcine.moviebooking_server.entity.PriceAdjustment;
import com.vietcine.moviebooking_server.entity.Seat;
import com.vietcine.moviebooking_server.entity.SeatPrice;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.hibernate.annotations.Nationalized;

import java.util.LinkedHashSet;
import java.util.Set;

@Data
@AllArgsConstructor
public class SeatTypeResponse {
    private Integer id;
    private String typeName;
    private Set<PriceAdjustment> priceAdjustments;
    private Set<SeatPrice> seatPrices;
}
