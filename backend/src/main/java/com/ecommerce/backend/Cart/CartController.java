package com.ecommerce.backend.Cart;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;

@RestController
@RequestMapping("/api/cart")
@CrossOrigin(origins = "*")
public class CartController {

    @Autowired
    private CartRepository cartRepo;

    // ➕ Add to cart
    @PostMapping("/add")
    public Cart addToCart(@RequestParam("userId") String userId,
            @RequestParam("productId") String productId,
            @RequestParam("quantity") int quantity) {

        Cart cart = cartRepo.findByUserId(userId);

        if (cart == null) {
            cart = new Cart();
            cart.setUserId(userId);
            cart.setItems(new ArrayList<>());
        }

        if (cart.getItems() == null) {
            cart.setItems(new ArrayList<>());
        }

        // Check if product already exists in cart, then just update quantity
        boolean exists = false;
        for (CartItem item : cart.getItems()) {
            if (item.getProductId().equals(productId)) {
                item.setQuantity(item.getQuantity() + quantity);
                exists = true;
                break;
            }
        }

        if (!exists) {
            CartItem item = new CartItem();
            item.setProductId(productId);
            item.setQuantity(quantity);
            cart.getItems().add(item);
        }

        return cartRepo.save(cart);
    }

    // 👀 Get cart by user
    @GetMapping("/{userId:.+}")
    public Cart getCart(@PathVariable("userId") String userId) {
        return cartRepo.findByUserId(userId);
    }

    // ❌ Remove item
    @DeleteMapping("/remove")
    public ResponseEntity<?> removeItem(@RequestParam String userId,
            @RequestParam String productId) {

        Cart cart = cartRepo.findByUserId(userId);

        if (cart == null) {
            return ResponseEntity.badRequest().body("Cart not found");
        }

        if (cart.getItems() == null || cart.getItems().isEmpty()) {
            return ResponseEntity.badRequest().body("Cart is empty");
        }

        boolean removed = cart.getItems().removeIf(
                item -> item.getProductId().equals(productId));

        if (!removed) {
            return ResponseEntity.badRequest().body("Product not found in cart");
        }

        Cart updatedCart = cartRepo.save(cart);
        return ResponseEntity.ok(updatedCart);
    }
}