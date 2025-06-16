package com.vietcine.moviebooking_server.service.foodOrder;

import com.vietcine.moviebooking_server.dto.request.FoodOrderDetailRequest;
import com.vietcine.moviebooking_server.dto.request.FoodOrderRequest;
import com.vietcine.moviebooking_server.dto.request.FoodOrderUpdateRequest;
import com.vietcine.moviebooking_server.dto.response.FoodOrderResponse;
import com.vietcine.moviebooking_server.entity.*;
import com.vietcine.moviebooking_server.mapper.FoodOrderMapper;
import com.vietcine.moviebooking_server.repository.*;
import lombok.AllArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.LinkedHashSet;
import java.util.Set;

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

    @Override
    public FoodOrderResponse createFoodOrder(FoodOrderRequest foodOrderRequest) {
        // Validate User
        User user = userRepository.findById(Long.valueOf(foodOrderRequest.getUserId()))
                .orElseThrow(() -> new IllegalArgumentException("User not found with ID: " + foodOrderRequest.getUserId()));

        // Validate Theater
        Theater theater = theaterRepository.findById(foodOrderRequest.getTheaterId())
                .orElseThrow(() -> new IllegalArgumentException("Theater not found with ID: " + foodOrderRequest.getTheaterId()));

        // Validate Payment
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
        newFoodOrder.setFoodOrderDetails(new LinkedHashSet<>());

        // Save the food order first to generate its ID
        newFoodOrder = foodOrderRepository.save(newFoodOrder);

        // Handle food details
        Set<FoodOrderDetail> foodOrderDetails = new LinkedHashSet<>();
        if (foodOrderRequest.getFoodDetails() != null && !foodOrderRequest.getFoodDetails().isEmpty()) {
            for (FoodOrderDetailRequest detailRequest : foodOrderRequest.getFoodDetails()) {
                Food food = foodRepository.findById(detailRequest.getFoodId())
                        .orElseThrow(() -> new IllegalArgumentException("Food not found with ID: " + detailRequest.getFoodId()));

                FoodOrderDetail foodOrderDetail = new FoodOrderDetail();
                foodOrderDetail.setFoodOrder(newFoodOrder);
                foodOrderDetail.setFood(food);
                foodOrderDetail.setQuantity(detailRequest.getQuantity());
                foodOrderDetails.add(foodOrderDetail);
            }
            foodOrderDetailRepository.saveAll(foodOrderDetails);
            newFoodOrder.setFoodOrderDetails(foodOrderDetails);
        }

        // Save the food order again to update relationships
        newFoodOrder = foodOrderRepository.save(newFoodOrder);

        // Map to FoodOrderResponse using MapStruct
        return foodOrderMapper.toFoodOrderResponse(newFoodOrder);
    }

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

        // Map to FoodOrderResponse using MapStruct
        return foodOrderMapper.toFoodOrderResponse(updatedFoodOrder);
    }
} 