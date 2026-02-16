package org.policy.controller;

import java.util.List;
import org.policy.entity.Claim;
import org.policy.enums.ClaimStatus;
import org.policy.service.ClaimService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/claims")
@CrossOrigin(origins = "http://localhost:4200")
public class ClaimController {
    private final ClaimService claimService;

    public ClaimController(ClaimService claimService) {
        this.claimService = claimService;
    }

    @PostMapping("/apply/{userId}")
    public Claim applyClaim(@RequestBody Claim claim, @PathVariable Long userId) {
        return claimService.applyClaim(claim, userId);
    }

    @GetMapping("/user/{userId}")
    public List<Claim> getClaimsForUser(@PathVariable Long userId) {
        return claimService.getClaimsForUser(userId);
    }

    @PutMapping("/update/{claimId}")
    public Claim updateClaim(@PathVariable Long claimId, @RequestBody Claim claim) {
        return claimService.updateClaim(claimId, claim);
    }

    @DeleteMapping("/{claimId}")
    public ResponseEntity<Void> deleteClaim(@PathVariable Long claimId) {
        claimService.deleteClaim(claimId);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/pending")
    public List<Claim> getClaimsForApproval() {
        return claimService.getClaimsForApproval();
    }

    @GetMapping("/")
    public List<Claim> getAllClaims() {
        return claimService.getAllClaims();
    }

    @PutMapping("/approve/{claimId}")
    public Claim approveClaim(@PathVariable Long claimId) {
        return claimService.approveOrRejectClaim(claimId, ClaimStatus.APPROVED);
    }

    @PutMapping("/reject/{claimId}")
    public Claim rejectClaim(@PathVariable Long claimId) {
        return claimService.approveOrRejectClaim(claimId, ClaimStatus.REJECTED);
    }
}
