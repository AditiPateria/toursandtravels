package com.travel.api.validation;

import java.util.List;

import jakarta.validation.ConstraintValidator;
import jakarta.validation.ConstraintValidatorContext;

public class PasswordConstraintValidator implements ConstraintValidator<ValidPassword, String> {

	@Override
	public void initialize(ValidPassword constraintAnnotation) {
	}

	@Override
	public boolean isValid(String password, ConstraintValidatorContext context) {
		if (password == null) {
			return false;
		}

		List<String> errors = PasswordValidator.validatePassword(password);
		if (!errors.isEmpty()) {
			context.disableDefaultConstraintViolation();
			context.buildConstraintViolationWithTemplate(String.join(", ", errors)).addConstraintViolation();
			return false;
		}
		return true;
	}
}