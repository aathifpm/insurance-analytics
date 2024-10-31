import pandas as pd
import numpy as np
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler
from sklearn.ensemble import GradientBoostingClassifier
from sklearn.metrics import classification_report, confusion_matrix
import joblib

# Load and preprocess data
df = pd.read_csv('ml_server/insurance_claims.csv')

# Feature selection and engineering
features = [
    'months_as_customer', 'age', 'policy_deductable', 'policy_annual_premium',
    'umbrella_limit', 'incident_hour_of_the_day', 'number_of_vehicles_involved',
    'bodily_injuries', 'witnesses', 'injury_claim', 'property_claim', 
    'vehicle_claim', 'total_claim_amount'
]

# Create categorical features
categorical_features = [
    'policy_state', 'policy_csl', 'insured_sex', 'insured_education_level',
    'insured_occupation', 'insured_relationship', 'incident_type',
    'collision_type', 'incident_severity', 'authorities_contacted',
    'incident_state', 'police_report_available'
]

# Create feature matrix
X = pd.get_dummies(df[features + categorical_features], columns=categorical_features)
y = (df['fraud_reported'] == 'Y').astype(int)

# Split data
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42, stratify=y
)

# Scale features
scaler = StandardScaler()
X_train_scaled = scaler.fit_transform(X_train)
X_test_scaled = scaler.transform(X_test)

# Train model
model = GradientBoostingClassifier(
    n_estimators=100,
    learning_rate=0.1,
    max_depth=5,
    random_state=42
)

model.fit(X_train_scaled, y_train)

# Evaluate model
y_pred = model.predict(X_test_scaled)
print("\nClassification Report:")
print(classification_report(y_test, y_pred))

print("\nConfusion Matrix:")
print(confusion_matrix(y_test, y_pred))

# Get feature importance
feature_importance = pd.DataFrame({
    'feature': X.columns,
    'importance': model.feature_importances_
}).sort_values('importance', ascending=False)

print("\nTop 10 Most Important Features:")
print(feature_importance.head(10))

# Save model, scaler, and feature names
joblib.dump(model, 'ml_server/fraud_detection_model.pkl')
joblib.dump(scaler, 'ml_server/scaler.pkl')
joblib.dump(X.columns.tolist(), 'ml_server/feature_names.pkl')

print("\nModel, scaler, and feature names saved successfully")

# Save feature importance for reference
feature_importance.to_csv('ml_server/feature_importance.csv', index=False)