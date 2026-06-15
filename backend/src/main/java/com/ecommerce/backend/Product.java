package com.ecommerce.backend;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "products")
public class Product {

    @Id
    private String id;
    private String name;
    private double price;
    private String description;
    private String imageUrl;
    private String imageUrl2;
    private String imageUrl3;
    private String category;
    private boolean trending;
    private boolean offer;
    private boolean festivalOffer;
    private boolean newArrival;

    public Product() {}

    public Product(String name, double price, String description) {
        this.name = name;
        this.price = price;
        this.description = description;
    }

    // Getters & Setters
    public String getId() { return id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public double getPrice() { return price; }
    public void setPrice(double price) { this.price = price; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getImageUrl() { return imageUrl; }
    public void setImageUrl(String imageUrl) { this.imageUrl = imageUrl; }

    public String getImageUrl2() { return imageUrl2; }
    public void setImageUrl2(String imageUrl2) { this.imageUrl2 = imageUrl2; }

    public String getImageUrl3() { return imageUrl3; }
    public void setImageUrl3(String imageUrl3) { this.imageUrl3 = imageUrl3; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public boolean isTrending() { return trending; }
    public void setTrending(boolean trending) { this.trending = trending; }

    public boolean isOffer() { return offer; }
    public void setOffer(boolean offer) { this.offer = offer; }

    public boolean isFestivalOffer() { return festivalOffer; }
    public void setFestivalOffer(boolean festivalOffer) { this.festivalOffer = festivalOffer; }

    public boolean isNewArrival() { return newArrival; }
    public void setNewArrival(boolean newArrival) { this.newArrival = newArrival; }
}