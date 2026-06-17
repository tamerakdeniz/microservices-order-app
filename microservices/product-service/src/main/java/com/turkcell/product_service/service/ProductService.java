package com.turkcell.product_service.service;

import com.turkcell.product_service.dto.request.CreateProductRequest;
import com.turkcell.product_service.dto.request.UpdateProductRequest;
import com.turkcell.product_service.dto.response.ProductResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.UUID;

public interface ProductService {

    Page<ProductResponse> getAll(Pageable pageable);

    ProductResponse getById(UUID id);

    ProductResponse create(CreateProductRequest request);

    ProductResponse update(UUID id, UpdateProductRequest request);

    void delete(UUID id);
}
