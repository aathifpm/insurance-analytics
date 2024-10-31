from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import pandas as pd
import logging
from datetime import datetime

app = Flask(__name__)
CORS(app)

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

# Define valid categories for all fields
valid_categories = {
    'insurance_type': {
        'AUTO', 'HEALTH', 'PROPERTY', 'LIFE', 'LIABILITY', 
        'WORKERS_COMP', 'TRAVEL', 'BUSINESS', 'Unknown'
    },
    'policy_state': {
        'AL', 'AK', 'AZ', 'AR', 'CA', 'CO', 'CT', 'DE', 'FL', 'GA', 
        'HI', 'ID', 'IL', 'IN', 'IA', 'KS', 'KY', 'LA', 'ME', 'MD', 
        'MA', 'MI', 'MN', 'MS', 'MO', 'MT', 'NE', 'NV', 'NH', 'NJ', 
        'NM', 'NY', 'NC', 'ND', 'OH', 'OK', 'OR', 'PA', 'RI', 'SC', 
        'SD', 'TN', 'TX', 'UT', 'VT', 'VA', 'WA', 'WV', 'WI', 'WY',
        'Unknown'
    },
    'policy_csl': {
        '100/300', '250/500', '500/1000', 'Unknown'
    },
    'insured_sex': {
        'MALE', 'FEMALE', 'Unknown'
    },
    'insured_education_level': {
        'HIGH SCHOOL', 'COLLEGE', 'MASTERS', 'PHD', 'Unknown'
    },
    'insured_occupation': {
        'PROFESSIONAL', 'CLERICAL', 'MANAGER', 'STUDENT', 'RETIRED',
        'SELF-EMPLOYED', 'Unknown'
    },
    'incident_type': {
        'COLLISION', 'THEFT', 'FIRE', 'NATURAL_DISASTER', 'VANDALISM',
        'OTHER', 'Unknown'
    },
    'auto_incident_type': {
        'SINGLE VEHICLE COLLISION', 'MULTI-VEHICLE COLLISION', 
        'THEFT', 'VANDALISM', 'PARKING', 'Unknown'
    },
    'property_incident_type': {
        'FIRE', 'WATER_DAMAGE', 'THEFT', 'NATURAL_DISASTER', 
        'VANDALISM', 'STRUCTURAL', 'Unknown'
    },
    'health_incident_type': {
        'EMERGENCY', 'ROUTINE', 'SPECIALIST', 'SURGERY', 
        'PRESCRIPTION', 'Unknown'
    },
    'incident_severity': {
        'MINOR', 'MODERATE', 'MAJOR', 'SEVERE', 'TOTAL_LOSS', 'Unknown'
    },
    'authorities_contacted': {
        'POLICE', 'FIRE', 'AMBULANCE', 'NONE', 'OTHER', 'Unknown'
    },
    'police_report_available': {
        'YES', 'NO', 'Unknown'
    }
}

# Load trained model, scaler, and feature names
try:
    model = joblib.load('ml_server/fraud_detection_model.pkl')
    scaler = joblib.load('ml_server/scaler.pkl')
    feature_names = joblib.load('ml_server/feature_names.pkl')
    logger.info("Model components loaded successfully")
except Exception as e:
    logger.error(f"Error loading model components: {str(e)}")
    raise

def clean_numeric(value, default=0):
    """Clean and convert numeric values"""
    try:
        if isinstance(value, str):
            # Remove any non-numeric characters except decimal point
            value = ''.join(c for c in value if c.isdigit() or c == '.')
        return float(value) if value else default
    except (ValueError, TypeError):
        return default

def clean_categorical(value, valid_values, default='Unknown'):
    """Clean categorical values"""
    if not value or not isinstance(value, str):
        return default
    cleaned = str(value).upper().strip()
    return cleaned if cleaned in valid_values else default

def preprocess_claim(claim_data):
    """Convert claim data to model features with robust error handling"""
    try:
        logger.debug(f"Preprocessing claim data: {claim_data}")
        
        # Normalize insurance type
        insurance_type = claim_data.get('insurance_type', '').upper().replace(' ', '_')
        if insurance_type not in valid_categories['insurance_type']:
            insurance_type = 'Unknown'
        
        # Handle claim amount - check both possible field names
        claim_amount = clean_numeric(claim_data.get('claimAmount') or claim_data.get('claim_amount', 0))
        
        # Base features common to all insurance types
        base_features = {
            'months_as_customer': clean_numeric(claim_data.get('months_as_customer', 0)),
            'age': clean_numeric(claim_data.get('age', 0)),
            'policy_deductable': clean_numeric(claim_data.get('policy_deductable', 0)),
            'policy_annual_premium': clean_numeric(claim_data.get('policy_annual_premium', 0)),
            'umbrella_limit': clean_numeric(claim_data.get('umbrella_limit', 0)),
            'claim_amount': claim_amount,
            'total_claim_amount': claim_amount,
            'previous_claims': clean_numeric(claim_data.get('previous_claims', 0)),
            'policy_duration_months': clean_numeric(claim_data.get('policy_duration_months', 0))
        }

        # Insurance type specific features
        type_specific_features = {}
        if insurance_type in ['AUTO', 'PROPERTY_DAMAGE']:
            type_specific_features = {
                'number_of_vehicles': clean_numeric(claim_data.get('number_of_vehicles_involved', 1)),
                'bodily_injuries': clean_numeric(claim_data.get('bodily_injuries', 0)),
                'witnesses': clean_numeric(claim_data.get('witnesses', 0)),
                'injury_claim': clean_numeric(claim_data.get('injury_claim', 0)),
                'property_claim': clean_numeric(claim_data.get('property_claim', 0)),
                'vehicle_claim': clean_numeric(claim_data.get('vehicle_claim', 0))
            }

        # Combine features
        features = {**base_features, **type_specific_features}
        
        # Create DataFrame
        df = pd.DataFrame([features])
        
        # Add categorical variables with dummy encoding
        categorical_data = {
            'insurance_type': insurance_type,
            'policy_state': clean_categorical(
                claim_data.get('policy_state', 'Unknown'), 
                valid_categories['policy_state']
            ),
            'insured_sex': clean_categorical(
                claim_data.get('insured_sex', 'Unknown'), 
                valid_categories['insured_sex']
            ),
            'incident_severity': clean_categorical(
                claim_data.get('incident_severity', 'Unknown'), 
                valid_categories['incident_severity']
            ),
            'incident_type': clean_categorical(
                claim_data.get('incident_type', 'Unknown'), 
                valid_categories['incident_type']
            )
        }

        # Create dummy variables
        cat_df = pd.get_dummies(pd.DataFrame([categorical_data]))
        
        # Combine numerical and categorical features
        final_df = pd.concat([df, cat_df], axis=1)

        # Ensure all model features are present
        for feature in feature_names:
            if feature not in final_df.columns:
                final_df[feature] = 0

        # Select only the features used during training
        final_df = final_df[feature_names]

        return final_df

    except Exception as e:
        logger.error(f"Error in preprocess_claim: {str(e)}")
        raise

@app.route('/predict', methods=['POST'])
def predict():
    try:
        claim_data = request.json
        logger.debug(f"Received claim data: {claim_data}")

        if not claim_data:
            return jsonify({'error': 'No data provided'}), 400

        # Preprocess data
        try:
            features_df = preprocess_claim(claim_data)
            scaled_features = scaler.transform(features_df)
        except Exception as e:
            logger.error(f"Error preprocessing data: {str(e)}")
            return jsonify({'error': str(e)}), 400

        # Make prediction
        try:
            fraud_prob = float(model.predict_proba(scaled_features)[0][1])
        except Exception as e:
            logger.error(f"Error making prediction: {str(e)}")
            return jsonify({'error': str(e)}), 400

        # Get risk level
        risk_level = 'HIGH' if fraud_prob > 0.7 else 'MEDIUM' if fraud_prob > 0.4 else 'LOW'

        # Get feature importance
        feature_contributions = []
        try:
            for feature, importance in zip(features_df.columns, model.feature_importances_):
                if importance > 0:
                    feature_contributions.append({
                        'feature': feature,
                        'contribution': float(importance)
                    })
        except Exception as e:
            logger.error(f"Error calculating feature contributions: {str(e)}")
            feature_contributions = []

        # Check for anomalies
        anomalies = []
        try:
            if features_df['claim_amount'].iloc[0] > 50000:
                anomalies.append('High claim amount')
            if features_df.get('witnesses', [0])[0] == 0:
                anomalies.append('No witnesses reported')
        except Exception as e:
            logger.error(f"Error checking anomalies: {str(e)}")

        response_data = {
            'probability': fraud_prob,
            'riskLevel': risk_level,
            'featureContributions': sorted(feature_contributions, 
                                         key=lambda x: x['contribution'], 
                                         reverse=True)[:5],
            'anomalyIndicators': anomalies
        }

        logger.debug(f"Sending response: {response_data}")
        return jsonify(response_data)

    except Exception as e:
        logger.error(f"Unexpected error in predict endpoint: {str(e)}")
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=5000, debug=True)