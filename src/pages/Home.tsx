import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Container, Typography, Box, TextField } from '@mui/material';

const Home: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      navigate(`/tasks?email=${encodeURIComponent(email.trim())}`);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', background: 'linear-gradient(to right, #00c6ff, #0072ff)' }}>
      <Box 
        component="form"
        onSubmit={handleSubmit}
        sx={{ 
          padding: 4,
          backgroundColor: 'rgba(255, 255, 255, 0.9)', // Light translucent background for form
          borderRadius: '10px', // Rounded corners
          boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)', // Subtle shadow
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 3,
          width: '100%',
          maxWidth: 500,
        }}
      >
        <Typography 
          variant="h3" 
          component="h1" 
          gutterBottom
          sx={{
            fontFamily: 'Roboto, sans-serif',
            fontWeight: 700,
            color: '#333', // Dark text for better readability
          }}
        >
          Welcome to the Teacher's Site
        </Typography>
        
        <TextField
          fullWidth
          label="Enter your email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          variant="outlined"
          sx={{
            borderRadius: '8px', // Rounded input field
            '& .MuiInputBase-root': {
              borderRadius: '8px', // Ensure input has rounded corners
            },
          }}
        />

        <Button 
          type="submit"
          variant="contained" 
          size="large"
          disabled={!email.trim()}
          sx={{
            marginTop: 2,
            backgroundColor: '#0072ff',
            '&:hover': {
              backgroundColor: '#005bb5', // Darker blue on hover
            },
            borderRadius: '8px', // Rounded button corners
          }}
        >
          Get Started
        </Button>
      </Box>
    </Container>
  );
};

export default Home;
