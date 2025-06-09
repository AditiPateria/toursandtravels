package com.travel.api.validation;

import java.util.ArrayList;
import java.util.List;
import java.util.regex.Pattern;

public class PasswordValidator {
    private static final int MIN_LENGTH = 4;
    private static final int MAX_LENGTH = 30;
    private static final Pattern UPPERCASE_PATTERN = Pattern.compile("[A-Z]");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile("[a-z]");
    private static final Pattern DIGIT_PATTERN = Pattern.compile("\\d");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile("[!@#$%^&*(),.?\":{}|<>]");

    public static List<String> validatePassword(String password) {
        List<String> errors = new ArrayList<>();

        if (password.length() < MIN_LENGTH) {
            errors.add("Password must be at least " + MIN_LENGTH + " characters");
        }

        if (password.length() > MAX_LENGTH) {
            errors.add("Password must be less than " + MAX_LENGTH + " characters");
        }

        if (!UPPERCASE_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one uppercase letter");
        }

        if (!LOWERCASE_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one lowercase letter");
        }

        if (!DIGIT_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one number");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).find()) {
            errors.add("Password must contain at least one special character");
        }

        return errors;
    }
} 