export interface Claim {
    id: string;
    policyNumber: string;
    claimantName: string;
    claimType: string;
    claimAmount: number;
    claimDate: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Denied';
    documents: string[];
    updatedAt: string;
}

export interface DashboardMetrics {
    totalClaims: number;
    averageClaimAmount: number;
    claimFrequency: number;
    claimsByType: Record<string, number>;
    claimsByStatus: Record<string, number>;
}

export interface User {
    id: string;
    username: string;
    role: 'admin' | 'user';
}