package com.turkcell.product_service.service.impl;

import com.turkcell.product_service.dto.request.CreateProductRequest;
import com.turkcell.product_service.dto.request.UpdateProductRequest;
import com.turkcell.product_service.dto.response.ProductResponse;
import com.turkcell.product_service.dto.response.RestPage;
import com.turkcell.product_service.entity.Product;
import com.turkcell.product_service.exception.ProductNotFoundException;
import com.turkcell.product_service.mapper.ProductMapper;
import com.turkcell.product_service.repository.ProductRepository;
import com.turkcell.product_service.service.ProductService;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.Caching;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
public class ProductServiceImpl implements ProductService {

    private final ProductRepository productRepository;
    private final ProductMapper productMapper;

    public ProductServiceImpl(ProductRepository productRepository, ProductMapper productMapper) {
        this.productRepository = productRepository;
        this.productMapper = productMapper;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "productList", key = "#pageable")
    public Page<ProductResponse> getAll(Pageable pageable) {
        Page<ProductResponse> page = productRepository.findAll(pageable)
                .map(productMapper::toResponse);
        return new RestPage<>(page);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(cacheNames = "products", key = "#id")
    public ProductResponse getById(UUID id) {
        Product product = findProductOrThrow(id);
        return productMapper.toResponse(product);
    }

    @Override
    @Transactional
    @CacheEvict(cacheNames = "productList", allEntries = true)
    public ProductResponse create(CreateProductRequest request) {
        Product product = productMapper.toEntity(request);
        Product saved = productRepository.save(product);
        return productMapper.toResponse(saved);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "products", key = "#id"),
            @CacheEvict(cacheNames = "productList", allEntries = true)
    })
    public ProductResponse update(UUID id, UpdateProductRequest request) {
        Product product = findProductOrThrow(id);
        product.setName(request.name());
        product.setDescription(request.description());
        product.setPrice(request.price());
        product.setStock(request.stock());
        Product updated = productRepository.save(product);
        return productMapper.toResponse(updated);
    }

    @Override
    @Transactional
    @Caching(evict = {
            @CacheEvict(cacheNames = "products", key = "#id"),
            @CacheEvict(cacheNames = "productList", allEntries = true)
    })
    public void delete(UUID id) {
        if (!productRepository.existsById(id)) {
            throw new ProductNotFoundException(id);
        }
        productRepository.deleteById(id);
    }

    private Product findProductOrThrow(UUID id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new ProductNotFoundException(id));
    }
}
