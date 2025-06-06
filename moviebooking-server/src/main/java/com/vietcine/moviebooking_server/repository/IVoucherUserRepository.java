package com.vietcine.moviebooking_server.repository;

import com.vietcine.moviebooking_server.entity.VoucherUser;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface IVoucherUserRepository extends JpaRepository<VoucherUser, Integer> {
    @Query(value = "EXEC sp_GetActiveVouchersForUser @UserId = :userId, @TheaterBrandId = :theaterBrandId", nativeQuery = true)
    List<Object[]> findActiveVouchersForUser(@Param("userId") Integer userId, @Param("theaterBrandId") Integer theaterBrandId);

//    @Modifying
//    @Query("UPDATE VoucherUser vu SET vu.isUsed = true WHERE vu.voucherUserId = :voucherUserId")
//    int updateVoucherUserIsUsed(@Param("voucherUserId") Integer voucherUserId);
}
