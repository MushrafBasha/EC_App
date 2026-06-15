package com.ecommerce.backend;

import com.ecommerce.backend.Product;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface ProductRepository extends MongoRepository<Product, String> {
}