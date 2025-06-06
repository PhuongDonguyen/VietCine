package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class VoucherUserResponse {
    private Integer voucherId;
    private Integer discount;
    private LocalDate validFrom;
    private LocalDate validUntil;
    private Integer minBillPrice;
    private String description;
    private Integer theaterBrandId;
    private Integer voucherUserId;
    private Boolean isUsed;
}