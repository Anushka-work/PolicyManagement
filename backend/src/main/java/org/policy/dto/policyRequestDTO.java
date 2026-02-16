package org.policy.dto;

import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.policy.enums.AccountStatus;
import org.policy.enums.PlanType;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class policyRequestDTO {
    private Long id;
    private PlanType planType;
    private Integer tenure;
    private String premiumFrequency;
    private Double insuredAmount;
    private LocalDate issuanceDate;
    private LocalDate maturityDate;
    private Double premiumAmount;
    private Double maturityAmount;
    private String policyHolderName;
    private LocalDate dob;
    private String address;
    private String mobileNumber;
    private String incomeSource;
    private Double totalIncome;
    private AccountStatus policyStatus;
    private String nomineeName;
    private String nomineeContactNumber;
    private LocalDate nomineeDOB;
    private String nomineeRelationship;
    private String nomineePercentageStake;
}
