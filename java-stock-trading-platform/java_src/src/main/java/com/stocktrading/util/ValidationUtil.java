package com.stocktrading.util;

import java.util.regex.Pattern;

/**
 * Utility class for user input validation.
 * Demonstrates static helper methods and Regex validation.
 */
public class ValidationUtil {
    private static final Pattern EMAIL_PATTERN = Pattern.compile("^[A-Za-z0-9+_.-]+@(.+)$");

    public static boolean isValidEmail(String email) {
        if (email == null || email.trim().isEmpty()) return false;
        return EMAIL_PATTERN.matcher(email.trim()).matches();
    }

    public static boolean isValidPassword(String password) {
        return password != null && password.trim().length() >= 4;
    }

    public static boolean isPositiveNumber(double number) {
        return number > 0;
    }

    public static boolean isPositiveInteger(int number) {
        return number > 0;
    }
}
