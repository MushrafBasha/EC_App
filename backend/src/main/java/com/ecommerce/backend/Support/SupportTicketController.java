package com.ecommerce.backend.Support;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/support")
@CrossOrigin(origins = "*")
public class SupportTicketController {

    @Autowired
    private SupportTicketRepository repo;

    @GetMapping("/all")
    public List<SupportTicket> getAllTickets() {
        return repo.findAll();
    }

    @GetMapping("/user/{email:.+}")
    public List<SupportTicket> getUserTickets(@PathVariable("email") String email) {
        return repo.findByUserEmail(email);
    }

    @PostMapping
    public SupportTicket createTicket(@RequestBody SupportTicket ticket) {
        ticket.setStatus("OPEN");
        return repo.save(ticket);
    }

    @PutMapping("/{id:.+}/resolve")
    public SupportTicket resolveTicket(@PathVariable("id") String id) {
        SupportTicket ticket = repo.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setStatus("RESOLVED");
            return repo.save(ticket);
        }
        return null;
    }

    @PutMapping("/{id:.+}/reply")
    public SupportTicket replyAndResolveTicket(@PathVariable("id") String id, @RequestBody String replyMessage) {
        SupportTicket ticket = repo.findById(id).orElse(null);
        if (ticket != null) {
            ticket.setAdminReply(replyMessage);
            ticket.setStatus("RESOLVED");
            return repo.save(ticket);
        }
        return null;
    }
}
