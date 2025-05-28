package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ApiResponse<T> {
    private String message;
    private Boolean success;
    private T data;
    private PaginationMeta paginationMeta;

    public ApiResponse(String message, Boolean success, T data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }

    public ApiResponse(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }
}