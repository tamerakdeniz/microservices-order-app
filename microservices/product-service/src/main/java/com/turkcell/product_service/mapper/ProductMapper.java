package com.turkcell.product_service.mapper;

import com.turkcell.product_service.dto.request.CreateProductRequest;
import com.turkcell.product_service.dto.response.ProductResponse;
import com.turkcell.product_service.entity.Product;
import org.springframework.stereotype.Component;

@Component
public class ProductMapper {

    public Product toEntity(CreateProductRequest request) {
        return new Product(
                request.name(),
                request.description(),
                request.price(),
                request.stock()
        );
    }

    public ProductResponse toResponse(Product product) {
        return new ProductResponse(
                product.getId(),
                product.getName(),
                product.getDescription(),
                product.getPrice(),
                product.getStock()
        );
    }
}
