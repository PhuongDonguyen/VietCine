package com.vietcine.moviebooking_server.controller;
import com.vietcine.moviebooking_server.config.VNPayConfig;
import com.vietcine.moviebooking_server.dto.request.VNPayPaymentDTO;
import com.vietcine.moviebooking_server.service.vnpay.IVNPayService;
import com.vietcine.moviebooking_server.utils.VNPayUtil;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.Map;
import java.util.TreeMap;

@RestController
@RequestMapping("/api/vnpay-payment")
public class VNPayPaymentController {
    @Autowired
    private IVNPayService vnpayService;

    @Autowired
    private VNPayConfig vnpayConfig;

    @PostMapping("/create")
    public ResponseEntity<String> createPayment(@RequestBody VNPayPaymentDTO paymentDTO, HttpServletRequest request) {
        try {
            String paymentUrl = vnpayService.createPaymentURL(paymentDTO, request);
            System.out.println(paymentUrl);
            return ResponseEntity.ok(paymentUrl);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("Error generating payment URL: " + e.getMessage());
        }
    }

    @GetMapping("/vnpay_return")
    public ResponseEntity<Map<String, Object>> paymentReturn(HttpServletRequest request) {
        Map<String, String> vnp_Params = new HashMap<>();
        Map<String, String[]> parameterMap = request.getParameterMap();
        for (Map.Entry<String, String[]> entry : parameterMap.entrySet()) {
            vnp_Params.put(entry.getKey(), entry.getValue()[0]);
        }

        String vnp_SecureHash = vnp_Params.get("vnp_SecureHash");
        String vnp_TxnRef = vnp_Params.get("vnp_TxnRef");
        vnp_Params.remove("vnp_SecureHash");

        StringBuilder hashData = new StringBuilder();
        for (Map.Entry<String, String> entry : new TreeMap<>(vnp_Params).entrySet()) {
            try {
                hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
                hashData.append("=");
                hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                hashData.append("&");
            } catch (UnsupportedEncodingException e) {
                throw new RuntimeException("Error encoding parameters for checksum", e);
            }
        }
        hashData.deleteCharAt(hashData.length() - 1);

        String calculatedHash = VNPayUtil.hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
        Map<String, Object> response = new HashMap<>();

        if (vnp_SecureHash.equals(calculatedHash)) {
            String vnp_ResponseCode = vnp_Params.get("vnp_ResponseCode");
            response.put("status", vnp_ResponseCode.equals("00") ? "Success" : "Failed");
            response.put("transactionId", vnp_Params.get("vnp_TransactionNo"));
            response.put("amount", vnp_Params.get("vnp_Amount"));
            response.put("orderInfo", vnp_Params.get("vnp_OrderInfo"));
            response.put("vnp_TxnRef", vnp_TxnRef);
        } else {
            response.put("status", "Invalid checksum");
        }

        return ResponseEntity.status(HttpStatus.OK).body(response);
    }
}