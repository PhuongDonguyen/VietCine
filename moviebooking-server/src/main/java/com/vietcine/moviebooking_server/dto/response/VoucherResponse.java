package com.vietcine.moviebooking_server.dto.response;

import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@ToString
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class VoucherResponse {
    private Integer id;
    private Integer discount;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private Integer minBillPrice;
    private String description;
    private Integer theaterBrandId;
    private Boolean isActive;
} 