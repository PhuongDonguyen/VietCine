package com.vietcine.moviebooking_server.dto.request;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class VNPayPaymentDTO {
    private long amount;
    private String orderInfo;
    private String bankCode;
}
