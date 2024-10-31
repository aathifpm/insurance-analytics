import { Claim, DashboardMetrics } from '../types';

const mockClaims: Claim[] = [
  {
    id: '1',
    policyNumber: 'POL-001',
    claimantName: 'John Doe',
    claimType: 'Auto',
    claimAmount: 5000,
    claimDate: '2023-05-01',
    status: 'Approved',
    documents: [],
    updatedAt: ''
  },
  // Add more mock claims here
];

export const fetchClaims = (): Promise<Claim[]> => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockClaims), 500);
  });
};

export const fetchDashboardMetrics = (): Promise<DashboardMetrics> => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        totalClaims: mockClaims.length,
        averageClaimAmount: mockClaims.reduce((sum, claim) => sum + claim.claimAmount, 0) / mockClaims.length,
        claimFrequency: mockClaims.length / 30, // Assuming 30 days
        claimsByType: mockClaims.reduce((acc, claim) => {
          acc[claim.claimType] = (acc[claim.claimType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>),
        claimsByStatus: mockClaims.reduce((acc, claim) => {
          acc[claim.status] = (acc[claim.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
      });
    }, 500);
  });
};