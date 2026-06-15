package com.ecommerce.backend.User;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ecommerce.backend.User.User;
import com.ecommerce.backend.User.UserRepository;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    @Autowired
    private UserRepository userRepo;

    // 📝 REGISTER
    @PostMapping("/register")
    public String register(@RequestBody User user) {

        User existing = userRepo.findByEmail(user.getEmail());

        if (existing != null) {
            return "Email already exists";
        }

        userRepo.save(user);
        return "User registered successfully";
    }

    // 🔑 LOGIN
    @PostMapping("/login")
    public String login(@RequestBody User user) {

        User existing = userRepo.findByEmail(user.getEmail());

        if (existing == null) {
            return "User not found";
        }

        if (existing.getPassword().equals(user.getPassword())) {
            return "Login successful";
        } else {
            return "Invalid password";
        }
    }
}