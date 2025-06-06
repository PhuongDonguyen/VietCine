package com.vietcine.moviebooking_server.service.voucher;

import com.vietcine.moviebooking_server.dto.response.VoucherUserResponse;
import com.vietcine.moviebooking_server.repository.IVoucherUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class VoucherUserService implements IVoucherUserService{
    private IVoucherUserRepository voucherUserRepository;

    @Autowired
    public void VoucherUserService(IVoucherUserRepository voucherUserRepository) {
        this.voucherUserRepository = voucherUserRepository;
    }

    @Override
    public List<VoucherUserResponse> getActiveVouchersForUser(Integer userId, Integer theaterBrandId) {
        if (userId == null || theaterBrandId == null) {
            throw new IllegalArgumentException("UserId and TheaterBrandId must not be null");
        }
        List<Object[]> vouchers = voucherUserRepository.findActiveVouchersForUser(userId, theaterBrandId);
        return vouchers.stream().map(row -> new VoucherUserResponse(
                (Integer) row[0], // voucherId
                (Integer) row[1], // discount
                ((java.sql.Date) row[2]).toLocalDate(), // validFrom
                ((java.sql.Date) row[3]).toLocalDate(), // validUntil
                (Integer) row[4], // minBillPrice
                (String) row[5], // description
                (Integer) row[6], // theaterBrandId
                (Integer) row[7], // voucherUserId
                (Boolean) row[8] // isUsed
        )).toList();
    }
}
