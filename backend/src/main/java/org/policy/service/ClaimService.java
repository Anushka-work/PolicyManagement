package org.policy.service;

import java.util.List;
import org.policy.entity.Claim;
import org.policy.enums.ClaimStatus;

public interface ClaimService {
    Claim applyClaim(Claim claim, Long userId);

    List<Claim> getClaimsForUser(Long userId);

    Claim updateClaim(Long claimId, Claim claim);

    void deleteClaim(Long claimId);

    List<Claim> getClaimsForApproval();

    List<Claim> getAllClaims();

    Claim approveOrRejectClaim(Long claimId, ClaimStatus status);
}
