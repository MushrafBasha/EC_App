package com.ecommerce.backend.Support;

import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface SupportTicketRepository extends MongoRepository<SupportTicket, String> {
    List<SupportTicket> findByUserEmail(String userEmail);
}
