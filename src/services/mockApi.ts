import { Claim, User, DashboardMetrics } from '../types';

// Simulated database
let claims: Claim[] = [
  {
    id: '1',
    policyNumber: 'POL-001',
    claimantName: 'John Doe',
    claimType: 'Auto',
    claimAmount: 5000,
    claimDate: '2023-05-01',
    status: 'Approved',
    documents: [],
    updatedAt: new Date().toISOString() // Use current date as a string
  },
  {
    id: '2',
    policyNumber: 'POL-002',
    claimantName: 'Jane Smith',
    claimType: 'Home',
    claimAmount: 10000,
    claimDate: '2023-05-15',
    status: 'Under Review',
    documents: [],
    updatedAt: new Date().toISOString()
  },
  // Add more mock claims here
];

const users: { username: string; password: string; role: 'admin' | 'user' }[] = [
  { username: 'admin', password: 'adminpass', role: 'admin' },
  { username: 'user', password: 'userpass', role: 'user' },
];

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

const ITEMS_PER_PAGE = 10;

let lastChecked = Date.now();

export const api = {
  login: async (username: string, password: string): Promise<User | null> => {
    await delay(500); // Simulate network delay
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
      return { id: username, username: user.username, role: user.role };
    }
    return null;
  },

  fetchClaims: async (): Promise<Claim[]> => {
    await delay(500);
    return claims;
  },

  fetchClaimById: async (id: string): Promise<Claim | null> => {
    await delay(500);
    return claims.find(claim => claim.id === id) || null;
  },

  submitClaim: async (claim: Omit<Claim, 'id' | 'status' | 'updatedAt'>): Promise<Claim> => {
    await delay(500);
    const newClaim: Claim = {
      ...claim,
      id: String(claims.length + 1),
      status: 'Submitted',
      updatedAt: new Date().toISOString(),
    };
    claims.push(newClaim);
    return newClaim;
  },

  updateClaimStatus: async (id: string, newStatus: Claim['status']): Promise<Claim> => {
    await delay(500);
    const claim = claims.find(c => c.id === id);
    if (!claim) {
      throw new Error('Claim not found');
    }
    claim.status = newStatus;
    claim.updatedAt = new Date().toISOString();
    return claim;
  },

  fetchPendingClaims: async (): Promise<Claim[]> => {
    await delay(500);
    return claims.filter(claim => claim.status === 'Submitted');
  },

  reviewClaim: async (claimId: string, decision: 'approve' | 'deny'): Promise<void> => {
    await delay(500);
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      claim.status = decision === 'approve' ? 'Approved' : 'Denied';
      claim.updatedAt = new Date().toISOString();
    }
  },

  fetchDashboardMetrics: async (): Promise<DashboardMetrics> => {
    await delay(500);
    const claimsByType = claims.reduce((acc, claim) => {
      acc[claim.claimType] = (acc[claim.claimType] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const claimsByStatus = claims.reduce((acc, claim) => {
      acc[claim.status] = (acc[claim.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      totalClaims: claims.length,
      averageClaimAmount: claims.reduce((sum, claim) => sum + claim.claimAmount, 0) / claims.length,
      claimFrequency: claims.length / 30, // Assuming 30 days
      claimsByType,
      claimsByStatus
    };
  },

  generateReport: async (reportType: string): Promise<any> => {
    await delay(1000);
    switch (reportType) {
      case 'claimsSummary':
        return {
          totalClaims: claims.length,
          totalAmount: claims.reduce((sum, claim) => sum + claim.claimAmount, 0),
          averageAmount: claims.reduce((sum, claim) => sum + claim.claimAmount, 0) / claims.length,
        };
      case 'claimsByType':
        return claims.reduce((acc, claim) => {
          acc[claim.claimType] = (acc[claim.claimType] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      case 'claimsByStatus':
        return claims.reduce((acc, claim) => {
          acc[claim.status] = (acc[claim.status] || 0) + 1;
          return acc;
        }, {} as Record<string, number>);
      default:
        throw new Error('Invalid report type');
    }
  },

  uploadDocument: async (claimId: string, file: File): Promise<void> => {
    await delay(1000); // Simulate upload time
    const claim = claims.find(c => c.id === claimId);
    if (claim) {
      claim.documents.push(file.name);
    } else {
      throw new Error('Claim not found');
    }
  },

  checkForUpdates: async (): Promise<{ id: string; status: string }[]> => {
    await delay(500);
    // This is a mock implementation. In a real app, you'd compare with last check time
    return claims.map(claim => ({ id: claim.id, status: claim.status }));
  },

  // ... any other methods you have ...
};