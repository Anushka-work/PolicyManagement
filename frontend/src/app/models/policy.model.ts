export interface Policy {
  id?: number;
  planType?: string;
  tenure?: number;
  premiumFrequency?: string;
  insuredAmount?: number;
  issuanceDate?: string;
  maturityDate?: string;
  premiumAmount?: number;
  maturityAmount?: number;
  policyHolderName?: string;
  dob?: string;
  address?: string;
  mobileNumber?: string;
  incomeSource?: string;
  totalIncome?: number;
  policyStatus?: string;
  nomineeName?: string;
  nomineeContactNumber?: string;
  nomineeDOB?: string;
  nomineeRelationship?: string;
}
