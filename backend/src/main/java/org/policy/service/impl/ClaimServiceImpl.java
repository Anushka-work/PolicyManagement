package org.policy.service.impl;

import java.util.List;
import org.policy.entity.Claim;
import org.policy.enums.ClaimStatus;
import org.policy.repository.ClaimRepository;
import org.policy.service.ClaimService;
import org.springframework.stereotype.Service;

@Service
public class ClaimServiceImpl implements ClaimService {
    private final ClaimRepository claimRepository;

    public ClaimServiceImpl(ClaimRepository claimRepository) {
        this.claimRepository = claimRepository;
    }

    @Override
    public Claim applyClaim(Claim claim, Long userId) {
        claim.setUserId(userId);
        if (claim.getStatus() == null) {
            claim.setStatus(ClaimStatus.PENDING);
        }
        return claimRepository.save(claim);
    }

    @Override
    public List<Claim> getClaimsForUser(Long userId) {
        return claimRepository.findByUserId(userId);
    }

    @Override
    public Claim updateClaim(Long claimId, Claim claim) {
        Claim existing = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        existing.setClaimAmount(claim.getClaimAmount());
        existing.setClaimType(claim.getClaimType());
        existing.setClaimDocuments(claim.getClaimDocuments());
        if (claim.getStatus() != null) {
            existing.setStatus(claim.getStatus());
        }

        return claimRepository.save(existing);
    }

    @Override
    public void deleteClaim(Long claimId) {
        claimRepository.deleteById(claimId);
    }

    @Override
    public List<Claim> getClaimsForApproval() {
        return claimRepository.findByStatus(ClaimStatus.PENDING);
    }

    @Override
    public List<Claim> getAllClaims() {
        return claimRepository.findAll();
    }

    @Override
    public Claim approveOrRejectClaim(Long claimId, ClaimStatus status) {
        Claim existing = claimRepository.findById(claimId)
                .orElseThrow(() -> new RuntimeException("Claim not found"));

        existing.setStatus(status);
        return claimRepository.save(existing);
    }
}
