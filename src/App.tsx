import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { theme } from './theme';
import LoginPage from './pages/LoginPage';
import { MaterialsPage } from './pages/MaterialsPage';
import './App.css';

function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className="App-background">
          <Router>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/materials" element={<MaterialsPage />} />
              <Route path="/" element={<Navigate to="/login" />} />
            </Routes>
          </Router>
        </div>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
