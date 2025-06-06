package com.vietcine.moviebooking_server.service.voucher;

import com.vietcine.moviebooking_server.dto.response.VoucherUserResponse;

import java.util.List;

public interface IVoucherUserService {
    List<VoucherUserResponse> getActiveVouchersForUser(Integer userId, Integer theaterBrandId);
}
