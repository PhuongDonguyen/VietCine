package com.vietcine.moviebooking_server.service.foodOrder;

import com.vietcine.moviebooking_server.dto.request.FoodOrderDetailRequest;
import com.vietcine.moviebooking_server.dto.request.FoodOrderRequest;
import com.vietcine.moviebooking_server.dto.request.FoodOrderUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.FoodOrderResponse;
import com.vietcine.moviebooking_server.entity.*;
import com.vietcine.moviebooking_server.mapper.FoodOrderMapper;
import com.vietcine.moviebooking_server.repository.*;
import jakarta.transaction.Transactional;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class FoodOrderService implements IFoodOrderService {

    @Autowired
    private IFoodOrderRepository foodOrderRepository;

    @Autowired
    private IUserRepository userRepository;

    @Autowired
    private ITheaterRepository theaterRepository;

    @Autowired
    private IPaymentRepository paymentRepository;

    @Autowired
    private IFoodRepository foodRepository;

    @Autowired
    private IFoodOrderDetailRepository foodOrderDetailRepository;

    @Autowired
    private FoodOrderMapper foodOrderMapper;

    @Transactional
    @Override
    public FoodOrderResponse createFoodOrder(FoodOrderRequest foodOrderRequest) {
        // Validate User, Theater, Payment
        User user = userRepository.findById(Long.valueOf(foodOrderRequest.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + foodOrderRequest.getUserId()));
        Theater theater = theaterRepository.findById(foodOrderRequest.getTheaterId())
                .orElseThrow(() -> new IllegalArgumentException("Theater not found with ID: " + foodOrderRequest.getTheaterId()));
        Payment payment = paymentRepository.findById(foodOrderRequest.getPaymentId())
                .orElseThrow(() -> new IllegalArgumentException("Payment not found with ID: " + foodOrderRequest.getPaymentId()));

        // Create new FoodOrder
        FoodOrder newFoodOrder = new FoodOrder();
        newFoodOrder.setUser(user);
        newFoodOrder.setTheater(theater);
        newFoodOrder.setReceiveDate(foodOrderRequest.getReceiveDate());
        newFoodOrder.setTotal(foodOrderRequest.getTotal());
        newFoodOrder.setStatus("Pending");
        newFoodOrder.setPayment(payment);
        newFoodOrder.setIsActive(foodOrderRequest.getIsActive());
        newFoodOrder.setVnpTxnRef(foodOrderRequest.getVnpTxnRef());

        // Handle multiple food details (1:N relationship)
        if (foodOrderRequest.getFoodDetails() != null && !foodOrderRequest.getFoodDetails().isEmpty()) {
            for (FoodOrderDetailRequest detailRequest : foodOrderRequest.getFoodDetails()) {
                Food food = foodRepository.findById(detailRequest.getFoodId())
                        .orElseThrow(() -> new IllegalArgumentException("Food not found with ID: " + detailRequest.getFoodId()));

                FoodOrderDetail foodOrderDetail = new FoodOrderDetail();
                foodOrderDetail.setFoodOrder(newFoodOrder);
                foodOrderDetail.setFood(food);
                foodOrderDetail.setQuantity(detailRequest.getQuantity());
                newFoodOrder.getFoodOrderDetails().add(foodOrderDetail);
            }
        }

        // Save once, cascade will handle FoodOrderDetails
        newFoodOrder = foodOrderRepository.save(newFoodOrder);

        return foodOrderMapper.toFoodOrderResponse(newFoodOrder);
    }

    @Transactional
    @Override
    public FoodOrderResponse updateFoodOrder(Integer id, FoodOrderUpdateRequest updateRequest) {
        // Find existing food order
        FoodOrder foodOrder = foodOrderRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Food order not found with ID: " + id));

        // Update fields based on status
        if (updateRequest.getVnpTxnRef() != null) {
            foodOrder.setVnpTxnRef(updateRequest.getVnpTxnRef());
        }

        if ("Success".equalsIgnoreCase(updateRequest.getStatus())) {
            foodOrder.setStatus("Success");
        } else if ("Failed".equalsIgnoreCase(updateRequest.getStatus())) {
            foodOrder.setStatus("Failed");
            foodOrder.setIsActive(false);
        } else {
            throw new IllegalArgumentException("Invalid status: " + updateRequest.getStatus() + ". Must be 'Success' or 'Failed'.");
        }

        // Save updated food order
        FoodOrder updatedFoodOrder = foodOrderRepository.save(foodOrder);

        // Map to FoodOrderResponse
        return foodOrderMapper.toFoodOrderResponse(updatedFoodOrder);
    }
}