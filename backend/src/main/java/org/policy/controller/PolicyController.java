package org.policy.controller;

import java.util.List;
import org.policy.entity.Policy;
import org.policy.service.PolicyService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/policy")
public class PolicyController {
    private final PolicyService policyService;

    public PolicyController(PolicyService policyService) {
        this.policyService = policyService;
    }

    @PostMapping("/issue/{userId}")
    public Policy issuePolicy(@PathVariable Long userId, @RequestBody Policy policy) {
        return policyService.issuePolicy(userId, policy);
    }

    @GetMapping("/")
    public List<Policy> getAllPolicies() {
        return policyService.getAllPolicies();
    }

    @GetMapping("/user/{userId}")
    public List<Policy> getPolicies(@PathVariable Long userId) {
        return policyService.getPolicies(userId);
    }

    @PutMapping("/{policyId}")
    public Policy updatePolicy(@PathVariable Long policyId, @RequestBody Policy policy) {
        return policyService.updatePolicy(policyId, policy);
    }

    @DeleteMapping("/{policyId}")
    public ResponseEntity<Void> deletePolicy(@PathVariable Long policyId) {
        policyService.deletePolicy(policyId);
        return ResponseEntity.ok().build();
    }
}
