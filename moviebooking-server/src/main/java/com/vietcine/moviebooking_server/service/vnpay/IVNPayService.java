package com.vietcine.moviebooking_server.service.vnpay;

import com.vietcine.moviebooking_server.dto.request.VNPayPaymentDTO;
import jakarta.servlet.http.HttpServletRequest;


public interface IVNPayService {
    String createPaymentURL(VNPayPaymentDTO paymentDTO, HttpServletRequest request);
}
