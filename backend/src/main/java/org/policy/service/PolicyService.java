package org.policy.service;

import java.util.List;
import org.policy.entity.Policy;

public interface PolicyService {
    Policy issuePolicy(Long userId, Policy policy);

    List<Policy> getAllPolicies();

    List<Policy> getPolicies(Long userId);

    Policy updatePolicy(Long policyId, Policy policy);

    void deletePolicy(Long policyId);
}
