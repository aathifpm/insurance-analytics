export interface Claim {
    id: string;
    policyNumber: string;
    claimantName: string;
    claimType: string;
    claimAmount: number;
    claimDate: string;
    status: 'Submitted' | 'Under Review' | 'Approved' | 'Denied';
    description?: string;
    documents: string[];
    updatedAt: string;
    policyDetails?: {
        months_as_customer: number;
        age: number;
        policy_deductable: number;
        policy_annual_premium: number;
        umbrella_limit: number;
        policy_state: string;
        policy_csl: string;
        insured_sex: string;
        insured_education_level: string;
        insured_occupation: string;
        insured_relationship: string;
    };
    incidentDetails?: {
        incident_type: string;
        collision_type: string;
        incident_severity: string;
        authorities_contacted: string;
        incident_state: string;
        police_report_available: string;
        number_of_vehicles_involved: number;
        bodily_injuries: number;
        witnesses: number;
        injury_claim: number;
        property_claim: number;
        vehicle_claim: number;
    };
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

export interface FraudAnalysisResult {
    probability: number;
    riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
    featureContributions: Array<{
        feature: string;
        contribution: number;
    }>;
    anomalyIndicators: string[];
}

export interface ClaimAnalysisData {
    claimDate: string;
    policyStartDate: string;
    claimAmount: number;
    previousClaimsCount: number;
    similarClaims30Days: number;
    documentationScore: number;
    distanceFromResidence: number;
}