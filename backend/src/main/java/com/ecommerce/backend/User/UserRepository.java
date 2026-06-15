package com.ecommerce.backend.User;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.ecommerce.backend.User.User;

public interface UserRepository extends MongoRepository<User, String> {

    User findByEmail(String email);
}