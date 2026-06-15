package com.ecommerce.backend.Cart;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ecommerce.backend.Cart.Cart;

public interface CartRepository extends MongoRepository<Cart, String> {

    Cart findByUserId(String userId);
}