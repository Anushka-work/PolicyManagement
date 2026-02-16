package org.policy.repository;

import java.util.List;
import org.policy.entity.Claim;
import org.policy.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ClaimRepository extends JpaRepository<Claim, Long> {
    List<Claim> findByUserId(Long userId);

    List<Claim> findByStatus(ClaimStatus status);
}
