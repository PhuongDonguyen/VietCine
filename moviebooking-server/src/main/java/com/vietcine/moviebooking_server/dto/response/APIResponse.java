package com.vietcine.moviebooking_server.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class APIResponse {
    private String message;
    private Boolean success;
    private Object data;
    private int total;
    private int page;
    private int size;

    public APIResponse(String message, Boolean success, Object data) {
        this.message = message;
        this.success = success;
        this.data = data;
    }

    public APIResponse(String message, Boolean success) {
        this.message = message;
        this.success = success;
    }
}