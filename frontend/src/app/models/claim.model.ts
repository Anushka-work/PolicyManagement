export interface Claim {
  id?: number;
  userId?: number;
  claimAmount?: number;
  claimType?: string;
  claimDocuments?: string;
  status?: string;
}
