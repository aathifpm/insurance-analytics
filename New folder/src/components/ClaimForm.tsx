import React, { useState } from 'react';
import {
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stepper,
  Step,
  StepLabel,
  Alert,
  Card,
  CardContent,
  IconButton,
  Stack,
  CircularProgress,
  SelectChangeEvent
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../services/mockApi';

interface ClaimFormData {
  policyNumber: string;
  claimantName: string;
  claimType: string;
  claimAmount: number;
  claimDate: string;
  description: string;
  documents: string[];
  dynamicFields?: Record<string, string | number>;
}

const steps = ['Basic Information', 'Claim Details', 'Supporting Documents'];

const insuranceTypeFields = {
  AUTO: [
    { name: 'vehicleModel', label: 'Vehicle Model', type: 'text' },
    { name: 'vehicleYear', label: 'Vehicle Year', type: 'number' },
    { name: 'accidentLocation', label: 'Accident Location', type: 'text' },
    { name: 'damageType', label: 'Type of Damage', type: 'select', options: [
      'Collision', 'Comprehensive', 'Liability'
    ]}
  ],
  PROPERTY: [
    { name: 'propertyAddress', label: 'Property Address', type: 'text' },
    { name: 'damageType', label: 'Type of Damage', type: 'select', options: [
      'Fire', 'Water', 'Weather', 'Theft', 'Other'
    ]},
    { name: 'incidentDate', label: 'Incident Date', type: 'date' }
  ],
  HEALTH: [
    { name: 'treatmentType', label: 'Treatment Type', type: 'select', options: [
      'Emergency', 'Routine', 'Specialist', 'Surgery'
    ]},
    { name: 'hospitalName', label: 'Hospital/Clinic Name', type: 'text' },
    { name: 'treatmentDate', label: 'Treatment Date', type: 'date' }
  ]
};

const ClaimForm: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState<ClaimFormData>({
    policyNumber: '',
    claimantName: '',
    claimType: '',
    claimAmount: 0,
    claimDate: new Date().toISOString().split('T')[0],
    description: '',
    documents: []
  });

  const [files, setFiles] = useState<File[]>([]);
  const [insuranceType, setInsuranceType] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const [dynamicFields, setDynamicFields] = useState<Record<string, string | number>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev: ClaimFormData) => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const newInsuranceType = e.target.value;
    setInsuranceType(newInsuranceType);
    setFormData(prev => ({ ...prev, claimType: newInsuranceType }));
    setDynamicFields({});
    setError('');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles(prev => [...prev, ...Array.from(e.target.files || [])]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (validateStep()) {
      setActiveStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(prev => prev - 1);
  };

  const validateStep = () => {
    switch (activeStep) {
      case 0:
        if (!formData.policyNumber || !formData.claimantName || !insuranceType) {
          setError('Please fill in all required fields');
          return false;
        }
        if (!/^\d{6,10}$/.test(formData.policyNumber)) {
          setError('Please enter a valid policy number (6-10 digits)');
          return false;
        }
        break;
      case 1:
        if (!formData.claimAmount || !formData.claimDate || !formData.description) {
          setError('Please fill in all required fields');
          return false;
        }
        if (formData.claimAmount <= 0) {
          setError('Claim amount must be greater than 0');
          return false;
        }
        const requiredFields = insuranceTypeFields[insuranceType as keyof typeof insuranceTypeFields] || [];
        const missingFields = requiredFields.filter(field => !dynamicFields[field.name]);
        if (missingFields.length > 0) {
          setError(`Please fill in: ${missingFields.map(f => f.label).join(', ')}`);
          return false;
        }
        break;
      case 2:
        if (files.length === 0) {
          setError('Please upload at least one document');
          return false;
        }
        const invalidFiles = files.filter(file => 
          !['image/jpeg', 'image/png', 'application/pdf'].includes(file.type) ||
          file.size > 5 * 1024 * 1024 // 5MB limit
        );
        if (invalidFiles.length > 0) {
          setError('Some files are invalid. Please upload only images or PDFs under 5MB');
          return false;
        }
        break;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep()) return;

    setIsSubmitting(true);
    setError('');

    try {
      const newClaim = await api.submitClaim({
        ...formData,
        claimAmount: Number(formData.claimAmount),
        documents: []
      });

      await Promise.all(
        files.map(file => api.uploadDocument(newClaim.id, file))
      );

      navigate('/claims');
    } catch (err) {
      setError('Failed to submit claim. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDynamicFieldChange = (name: string, value: string | number) => {
    setDynamicFields(prev => ({ ...prev, [name]: value }));
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Policy Number"
                name="policyNumber"
                value={formData.policyNumber}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Claimant Name"
                name="claimantName"
                value={formData.claimantName}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth required>
                <InputLabel>Insurance Type</InputLabel>
                <Select
                  value={insuranceType}
                  onChange={handleSelectChange}
                >
                  <MenuItem value="AUTO">Auto Insurance</MenuItem>
                  <MenuItem value="PROPERTY">Property Insurance</MenuItem>
                  <MenuItem value="HEALTH">Health Insurance</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            {insuranceType && (
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom color="primary">
                  Additional Information for {insuranceType.charAt(0) + insuranceType.slice(1).toLowerCase()} Insurance
                </Typography>
                <Grid container spacing={2}>
                  {insuranceTypeFields[insuranceType as keyof typeof insuranceTypeFields]?.map(field => (
                    <Grid item xs={12} sm={6} key={field.name}>
                      {field.type === 'select' ? (
                        <FormControl fullWidth required>
                          <InputLabel>{field.label}</InputLabel>
                          <Select
                            value={dynamicFields[field.name] || ''}
                            onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                            label={field.label}
                          >
                            {field.options?.map(option => (
                              <MenuItem key={option} value={option}>{option}</MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                      ) : (
                        <TextField
                          fullWidth
                          label={field.label}
                          type={field.type}
                          value={dynamicFields[field.name] || ''}
                          onChange={(e) => handleDynamicFieldChange(field.name, e.target.value)}
                          required
                        />
                      )}
                    </Grid>
                  ))}
                </Grid>
              </Grid>
            )}
          </Grid>
        );
      case 1:
        return (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Claim Amount"
                name="claimAmount"
                type="number"
                value={formData.claimAmount}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Claim Date"
                name="claimDate"
                type="date"
                value={formData.claimDate}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
          </Grid>
        );
      case 2:
        return (
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              Upload Supporting Documents
            </Typography>
            <IconButton
              color="primary"
              aria-label="upload document"
              component="label"
            >
              <input
                hidden
                accept="image/*"
                multiple
                type="file"
                onChange={handleFileChange}
              />
              <CloudUploadIcon />
            </IconButton>
            <Typography variant="body2" color="textSecondary">
              {files.length > 0 ? `Selected files: ${files.length}` : 'No files uploaded'}
            </Typography>
            <Stack direction="row" spacing={2}>
              {files.map((file, index) => (
                <Box key={index}>
                  <Typography variant="body1">{file.name}</Typography>
                  <IconButton
                    color="secondary"
                    aria-label="delete"
                    onClick={() => handleRemoveFile(index)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              ))}
            </Stack>
          </Stack>
        );
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: 'auto', py: 4 }}>
      <Card elevation={3}>
        <CardContent>
          <Typography variant="h4" gutterBottom align="center" color="primary">
            Submit New Insurance Claim
          </Typography>

          <Stepper activeStep={activeStep} sx={{ my: 4 }} alternativeLabel>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {renderStepContent()}

            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              mt: 4,
              pt: 2,
              borderTop: 1,
              borderColor: 'divider'
            }}>
              <Button
                disabled={activeStep === 0}
                onClick={handleBack}
                variant="outlined"
              >
                Back
              </Button>
              <Box>
                {activeStep === steps.length - 1 ? (
                  <Button
                    variant="contained"
                    color="primary"
                    type="submit"
                    disabled={isSubmitting}
                    startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
                  >
                    {isSubmitting ? 'Submitting...' : 'Submit Claim'}
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    onClick={handleNext}
                  >
                    Continue
                  </Button>
                )}
              </Box>
            </Box>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ClaimForm;