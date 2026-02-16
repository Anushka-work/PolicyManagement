package org.policy.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.LocalDate;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.policy.enums.AccountStatus;
import org.policy.enums.PlanType;

@Entity
@Table(name = "issue_policy")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Policy {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    @Enumerated(EnumType.STRING)
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

    @Enumerated(EnumType.STRING)
    private AccountStatus policyStatus;

    private String nomineeName;
    private String nomineeContactNumber;
    private LocalDate nomineeDOB;
    private String nomineeRelationship;
    private String nomineePercentageStake;
}
