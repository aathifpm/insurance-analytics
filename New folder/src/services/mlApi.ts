import axios from 'axios';

const ML_API_URL = 'http://localhost:5000';

export interface FraudDetectionResponse {
  probability: number;
  riskLevel: 'LOW' | 'MEDIUM' | 'HIGH';
  featureContributions: Array<{
    feature: string;
    contribution: number;
  }>;
  anomalyIndicators: string[];
}

export interface ClaimAnalysisData {
  insurance_type: string;
  months_as_customer: number;
  age: number;
  policy_deductable: number;
  policy_annual_premium: number;
  claim_amount: number;
  previous_claims: number;
  policy_duration_months: number;
  umbrella_limit: number;
  
  // Vehicle/Property specific
  number_of_vehicles_involved?: number;
  bodily_injuries?: number;
  witnesses?: number;
  injury_claim?: number;
  property_claim?: number;
  vehicle_claim?: number;
  
  // Categorical fields
  policy_state: string;
  insured_sex: string;
  incident_severity: string;
  incident_type: string;
}

export const mlApi = {
  async analyzeClaim(claimData: ClaimAnalysisData): Promise<FraudDetectionResponse> {
    try {
      console.log('Sending data to ML API:', claimData);
      const response = await axios.post(`${ML_API_URL}/predict`, claimData);
      console.log('ML API response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error calling ML API:', error);
      if (error.response) {
        console.error('Error response:', error.response.data);
        throw new Error(error.response.data.error || 'Error analyzing claim');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Error setting up request');
      }
    }
  }
}; 