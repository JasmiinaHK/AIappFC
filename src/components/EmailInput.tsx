import React, { useState } from 'react';
import { TextField, Button, Box, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface EmailInputProps {
  defaultEmail?: string;
}

const EmailInput: React.FC<EmailInputProps> = ({ defaultEmail = '' }) => {
  const [email, setEmail] = useState(defaultEmail);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Email je obavezan');
      return;
    }
    if (!validateEmail(email)) {
      setError('Molimo unesite ispravnu email adresu');
      return;
    }
    setError('');
    navigate(`/tasks?email=${encodeURIComponent(email)}`);
  };

  return (
    <Box p={3}>
      <Paper elevation={3} sx={{ p: 3, maxWidth: 400, mx: 'auto' }}>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email Adresa"
            variant="outlined"
            type="email"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError('');
            }}
            error={!!error}
            helperText={error}
            margin="normal"
          />
          <Box mt={2}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
            >
              Pregledaj Zadatke
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default EmailInput;