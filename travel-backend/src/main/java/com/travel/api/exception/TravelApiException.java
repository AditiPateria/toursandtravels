package com.travel.api.exception;

public class TravelApiException extends RuntimeException {
    public TravelApiException(String message) {
        super(message);
    }

    public TravelApiException(String message, Throwable cause) {
        super(message, cause);
    }
} 