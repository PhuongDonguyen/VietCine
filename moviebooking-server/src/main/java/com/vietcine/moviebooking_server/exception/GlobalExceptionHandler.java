package com.vietcine.moviebooking_server.exception;

import com.vietcine.moviebooking_server.dto.response.APIResponse;
import io.jsonwebtoken.MalformedJwtException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getFieldErrors().forEach(error ->
                errors.put(error.getField(), error.getDefaultMessage()));

        return ResponseEntity.badRequest().body(errors);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<APIResponse> handleHttpMessageNotReadableException(HttpMessageNotReadableException ex) {
        return ResponseEntity.badRequest().body(new APIResponse(ex.getMessage(), false));
    }

    @ExceptionHandler(DataIntegrityViolationException.class)
    public ResponseEntity<APIResponse> handleDataIntegrityViolationException(DataIntegrityViolationException ex) {
        APIResponse response = new APIResponse(ex.getMessage(), false);
        return new ResponseEntity<>(response, HttpStatus.CONFLICT); // 409
    }

    @ExceptionHandler(MalformedJwtException.class)
    public ResponseEntity<APIResponse> handleMalformedJwtException(MalformedJwtException ex) {
        System.out.println("In here in global exception handler");
        return new ResponseEntity<>(new APIResponse("Token không hợp lệ: " + ex.getMessage(), false), HttpStatus.UNAUTHORIZED);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<APIResponse> handleGeneralException(Exception ex) {
        return new ResponseEntity<>(new APIResponse("Đã có lỗi xảy ra: " + ex.getMessage(), false), HttpStatus.INTERNAL_SERVER_ERROR);
    }
}