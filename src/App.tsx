import React from 'react';
import { BrowserRouter as Router, Routes, Route, createRoutesFromElements } from 'react-router-dom';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { theme } from './theme';
import Home from './pages/Home';
import TasksPage from './pages/TasksPage';

const router = createRoutesFromElements(
  <>
    <Route path="/" element={<Home />} />
    <Route path="/tasks" element={<TasksPage />} />
  </>
);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Router future={{ v7_startTransition: true }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tasks" element={<TasksPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}

export default App;
