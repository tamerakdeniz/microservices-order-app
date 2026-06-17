package com.turkcell.product_service.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record UpdateProductRequest(

        @NotBlank(message = "name cannot be blank")
        @Size(max = 255, message = "name must be at most 255 characters")
        String name,

        String description,

        @NotNull(message = "price is required")
        @PositiveOrZero(message = "price cannot be negative")
        BigDecimal price,

        @NotNull(message = "stock is required")
        @PositiveOrZero(message = "stock cannot be negative")
        Integer stock
) {
}
