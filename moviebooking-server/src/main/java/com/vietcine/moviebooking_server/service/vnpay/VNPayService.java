package com.vietcine.moviebooking_server.service.vnpay;
import com.vietcine.moviebooking_server.config.VNPayConfig;
import com.vietcine.moviebooking_server.dto.request.VNPayPaymentDTO;
import com.vietcine.moviebooking_server.utils.VNPayUtil;
import org.springframework.stereotype.Service;
import jakarta.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.TreeMap;

@Service
public class VNPayService implements IVNPayService {

    private final VNPayConfig vnpayConfig;
    private final VNPayUtil vnpayUtils;

    public VNPayService(VNPayConfig vnpayConfig, VNPayUtil vnpayUtils) {
        this.vnpayConfig = vnpayConfig;
        this.vnpayUtils = vnpayUtils;
    }


    @Override
    public String createPaymentURL(VNPayPaymentDTO paymentDTO, HttpServletRequest request) {
        String version = "2.1.0";
        String command = "pay";
        String orderType = "other";
        long amount = paymentDTO.getAmount() * 100; // VNPAY uses 100x amount
        String bankCode = paymentDTO.getBankCode();
        String transactionReference = VNPayUtil.getRandomNumber(8);
        String clientIPAddress = VNPayUtil.getIpAddress(request);
        String terminalCode = vnpayConfig.getTmnCode();

        Map<String, String> params = new TreeMap<>();
        params.put("vnp_Version", version);
        params.put("vnp_Command", command);
        params.put("vnp_TmnCode", terminalCode);
        params.put("vnp_Amount", String.valueOf(amount));
        params.put("vnp_CurrCode", "VND");
        params.put("vnp_TxnRef", transactionReference);
        params.put("vnp_OrderInfo", paymentDTO.getOrderInfo());
        params.put("vnp_OrderType", orderType);
        params.put("vnp_Locale", "vn");
        params.put("vnp_ReturnUrl", vnpayConfig.getReturnUrl());
        params.put("vnp_IpAddr", clientIPAddress);

        String createDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date());
        String expireDate = new SimpleDateFormat("yyyyMMddHHmmss").format(new Date(System.currentTimeMillis() + 15 * 60 * 1000));
        params.put("vnp_CreateDate", createDate);
        params.put("vnp_ExpireDate", expireDate);

        if (bankCode != null && !bankCode.isEmpty()) {
            params.put("vnp_BankCode", bankCode);
        }

        try {
            StringBuilder hashData = new StringBuilder();
            for (Map.Entry<String, String> entry : params.entrySet()) {
                hashData.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
                hashData.append("=");
                hashData.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                hashData.append("&");
            }
            hashData.deleteCharAt(hashData.length() - 1);

            String secureHash = VNPayUtil.hmacSHA512(vnpayConfig.getHashSecret(), hashData.toString());
            params.put("vnp_SecureHash", secureHash);

            StringBuilder paymentUrl = new StringBuilder(vnpayConfig.getPaymentUrl()).append("?");
            for (Map.Entry<String, String> entry : params.entrySet()) {
                paymentUrl.append(URLEncoder.encode(entry.getKey(), StandardCharsets.UTF_8.toString()));
                paymentUrl.append("=");
                paymentUrl.append(URLEncoder.encode(entry.getValue(), StandardCharsets.UTF_8.toString()));
                paymentUrl.append("&");
            }
            paymentUrl.deleteCharAt(paymentUrl.length() - 1);

            return paymentUrl.toString();
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException("Error encoding URL parameters", e);
        }
    }
}