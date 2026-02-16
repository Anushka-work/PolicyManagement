package org.policy.service.impl;

import java.time.LocalDate;
import java.util.List;
import org.policy.entity.Policy;
import org.policy.entity.User;
import org.policy.enums.PlanType;
import org.policy.repository.PolicyRepository;
import org.policy.repository.UserRepository;
import org.policy.service.PolicyService;
import org.springframework.stereotype.Service;

@Service
public class PolicyServiceImpl implements PolicyService {
    private final PolicyRepository policyRepository;
    private final UserRepository userRepository;

    public PolicyServiceImpl(PolicyRepository policyRepository, UserRepository userRepository) {
        this.policyRepository = policyRepository;
        this.userRepository = userRepository;
    }

    @Override
    public Policy issuePolicy(Long userId, Policy policy) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        policy.setUser(user);

        LocalDate issuanceDate = policy.getIssuanceDate() == null ? LocalDate.now() : policy.getIssuanceDate();
        policy.setIssuanceDate(issuanceDate);

        if (policy.getTenure() != null) {
            policy.setMaturityDate(issuanceDate.plusYears(policy.getTenure()));
        }

        policy.setPremiumAmount(calculatePremium(policy.getInsuredAmount(), policy.getPremiumFrequency()));
        policy.setMaturityAmount(
                calculateMaturityAmount(policy.getInsuredAmount(), policy.getPlanType(), policy.getTenure()));

        return policyRepository.save(policy);
    }

    @Override
    public List<Policy> getAllPolicies() {
        return policyRepository.findAll();
    }

    @Override
    public List<Policy> getPolicies(Long userId) {
        return policyRepository.findByUserId(userId);
    }

    @Override
    public Policy updatePolicy(Long policyId, Policy policy) {
        Policy existing = policyRepository.findById(policyId)
                .orElseThrow(() -> new RuntimeException("Policy not found"));

        policy.setId(existing.getId());
        if (policy.getUser() == null) {
            policy.setUser(existing.getUser());
        }

        LocalDate issuanceDate = policy.getIssuanceDate() == null
                ? existing.getIssuanceDate()
                : policy.getIssuanceDate();
        policy.setIssuanceDate(issuanceDate);

        if (policy.getTenure() != null) {
            policy.setMaturityDate(issuanceDate.plusYears(policy.getTenure()));
        }

        policy.setPremiumAmount(calculatePremium(policy.getInsuredAmount(), policy.getPremiumFrequency()));
        policy.setMaturityAmount(
                calculateMaturityAmount(policy.getInsuredAmount(), policy.getPlanType(), policy.getTenure()));

        return policyRepository.save(policy);
    }

    @Override
    public void deletePolicy(Long policyId) {
        policyRepository.deleteById(policyId);
    }

    private Double calculatePremium(Double insuredAmount, String frequency) {
        if (insuredAmount == null) {
            return 0.0;
        }
        String normalized = frequency == null ? "monthly" : frequency.trim().toLowerCase();
        double multiplier;
        switch (normalized) {
            case "yearly":
                multiplier = 0.08;
                break;
            case "quarterly":
                multiplier = 0.025;
                break;
            case "monthly":
            default:
                multiplier = 0.01;
                break;
        }
        return insuredAmount * multiplier;
    }

    private Double calculateMaturityAmount(Double insuredAmount, PlanType planType, Integer tenure) {
        if (insuredAmount == null || tenure == null) {
            return 0.0;
        }
        double rate;
        if (planType == null) {
            rate = 0.03;
        } else {
            switch (planType) {
                case TERM_LIFE:
                    rate = 0.03;
                    break;
                case HEALTH_ENSURANCE:
                    rate = 0.04;
                    break;
                case WHOLE_LIFE:
                    rate = 0.05;
                    break;
                default:
                    rate = 0.03;
                    break;
            }
        }
        return insuredAmount * (1 + rate * tenure);
    }
}
