import React from 'react';
import { TextField, MenuItem } from '@mui/material';

interface FormFieldProps {
  name: string;
  label: string;
  type: string;
  value?: any;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  options?: { value: string; label: string }[];
}

const FormField: React.FC<FormFieldProps> = ({ 
  name, 
  label, 
  type, 
  value, 
  onChange,
  options 
}) => {
  if (type === 'select' && options) {
    return (
      <TextField
        select
        fullWidth
        name={name}
        label={label}
        value={value || ''}
        onChange={onChange}
        margin="normal"
      >
        {options.map(option => (
          <MenuItem key={option.value} value={option.value}>
            {option.label}
          </MenuItem>
        ))}
      </TextField>
    );
  }

  return (
    <TextField
      fullWidth
      name={name}
      label={label}
      type={type}
      value={value || ''}
      onChange={onChange}
      margin="normal"
    />
  );
};

export default FormField; 