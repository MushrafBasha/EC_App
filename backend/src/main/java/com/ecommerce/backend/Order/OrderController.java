package com.ecommerce.backend.Order;

import com.ecommerce.backend.Product;
import com.ecommerce.backend.ProductRepository;

import com.ecommerce.backend.Cart.Cart;
import com.ecommerce.backend.Cart.CartItem;
import com.ecommerce.backend.Cart.CartRepository;

import com.ecommerce.backend.Order.Order;
import com.ecommerce.backend.Order.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*")
public class OrderController {

    @Autowired
    private OrderRepository orderRepo;

    @Autowired
    private CartRepository cartRepo;

    @Autowired
    private ProductRepository productRepo;

    // 🛒 PLACE ORDER (CHECKOUT)
    @PostMapping("/checkout/{userId:.+}")
    public Order placeOrder(@PathVariable("userId") String userId,
            @RequestBody(required = false) java.util.Map<String, String> payload) {

        Cart cart = cartRepo.findByUserId(userId);

        if (cart == null || cart.getItems() == null || cart.getItems().isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        double total = 0;

        for (CartItem item : cart.getItems()) {
            Product product = productRepo.findById(item.getProductId()).orElse(null);
            if (product != null) {
                total += product.getPrice() * item.getQuantity();
            }
        }

        String address = (payload != null && payload.containsKey("address")) ? payload.get("address")
                : "No Address Provided";
        String payMethod = (payload != null && payload.containsKey("paymentMethod")) ? payload.get("paymentMethod")
                : "Credit Card";
        String shipMethod = (payload != null && payload.containsKey("shippingMethod")) ? payload.get("shippingMethod")
                : "Standard Shipping";

        Order order = new Order();
        order.setUserId(userId);
        order.setItems(cart.getItems());
        order.setTotalAmount(total);
        order.setStatus("PLACED");
        order.setDeliveryAddress(address);
        order.setPaymentMethod(payMethod);
        order.setShippingMethod(shipMethod);

        // Generate a simple tracking ID
        order.setTrackingId("TRK" + System.currentTimeMillis());
        order.setEstimatedDelivery("5-7 Business Days");

        // save order
        Order savedOrder = orderRepo.save(order);

        // clear cart after order
        cart.setItems(new java.util.ArrayList<>());
        cartRepo.save(cart);

        return savedOrder;
    }

    // 📦 GET USER ORDERS
    @GetMapping("/{userId:.+}")
    public List<Order> getOrders(@PathVariable("userId") String userId) {
        return orderRepo.findByUserId(userId);
    }

    // 👑 ADMIN: GET ALL ORDERS
    @GetMapping("/all")
    public List<Order> getAllOrders() {
        return orderRepo.findAll();
    }

    // 📝 UPDATE ORDER STATUS (Admin or User changing to CANCELLED)
    @PutMapping("/{id:.+}/status")
    public Order updateOrderStatus(@PathVariable("id") String id, @RequestParam("status") String status) {
        Order order = orderRepo.findById(id).orElse(null);
        if (order != null) {
            order.setStatus(status);
            return orderRepo.save(order);
        }
        return null;
    }
}