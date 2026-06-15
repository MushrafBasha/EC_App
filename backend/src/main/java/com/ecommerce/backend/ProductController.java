package com.ecommerce.backend;

import com.ecommerce.backend.Product;
import com.ecommerce.backend.ProductRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*")
public class ProductController {

    @Autowired
    private ProductRepository repo;

    // GET all products
    @GetMapping
    public List<Product> getAllProducts() {
        return repo.findAll();
    }

    @GetMapping("/{id:.+}")
    public Product getProductById(@PathVariable("id") String id) {
        return repo.findById(id).orElse(null);
    }

    // POST add product
    @PostMapping
    public Product addProduct(@RequestBody Product product) {
        return repo.save(product);
    }

    @PutMapping("/{id:.+}")
    public Product updateProduct(@PathVariable("id") String id, @RequestBody Product updatedProduct) {

        Product product = repo.findById(id).orElse(null);

        if (product != null) {
            product.setName(updatedProduct.getName());
            product.setPrice(updatedProduct.getPrice());
            product.setDescription(updatedProduct.getDescription());
            product.setImageUrl(updatedProduct.getImageUrl());
            product.setImageUrl2(updatedProduct.getImageUrl2());
            product.setImageUrl3(updatedProduct.getImageUrl3());
            product.setCategory(updatedProduct.getCategory());
            product.setTrending(updatedProduct.isTrending());
            product.setOffer(updatedProduct.isOffer());
            return repo.save(product);
        }

        return null;
    }

    @DeleteMapping("/{id:.+}")
    public String deleteProduct(@PathVariable("id") String id) {
        repo.deleteById(id);
        return "Product deleted successfully";
    }

}