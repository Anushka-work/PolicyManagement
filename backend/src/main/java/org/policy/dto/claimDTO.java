package org.policy.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.policy.enums.ClaimStatus;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class claimDTO {
    private Long id;
    private Long userId;
    private Double claimAmount;
    private String claimType;
    private String claimDocuments;
    private ClaimStatus status;
}
