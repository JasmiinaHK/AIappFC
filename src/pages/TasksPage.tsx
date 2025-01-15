import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Button,
  Box,
  CircularProgress,
  Alert
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { MaterialDialog } from '../components/MaterialDialog';
import { TaskCard } from '../components/TaskCard';
import { createMaterial, deleteMaterial, generateContent } from '../API/materialApi';
import { useTasks } from '../hooks/useTasks';
import { Material } from '../types/material';

export const TasksPage: React.FC = () => {
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const email = localStorage.getItem('email');
  const { data, isLoading, isError, refetch } = useTasks(email);
  const materials = data?.content || [];

  if (!email) {
    navigate('/login');
    return null;
  }

  const handleCreate = async (material: Omit<Material, 'id' | 'generatedContent'>) => {
    try {
      setError(null);
      await createMaterial(material);
      setDialogOpen(false);
    } catch (err) {
      console.error('Error creating material:', err);
      setError('Failed to create material');
    }
  };

  const handleDelete = async (id: number) => {
    if (!id || !email) return;
    try {
      setError(null);
      setDeletingId(id);
      await deleteMaterial(id, email);
      await refetch();
    } catch (error) {
      console.error('Error deleting material:', error);
      setError('Failed to delete material');
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerate = async (id: number) => {
    try {
      setError(null);
      setGeneratingId(id);
      const material = materials.find(m => m.id === id);
      if (!material) {
        throw new Error('Material not found');
      }
      await generateContent(id, material);
      // Refresh the tasks list after successful generation
      await refetch();
    } catch (err: any) {
      console.error('Error generating content:', err);
      setError(err.message || 'Failed to generate content');
    } finally {
      setGeneratingId(null);
    }
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" component="h1">
          {email ? `${email.split('@')[0]}'s Materials` : 'My Materials'}
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => setDialogOpen(true)}
        >
          Create Material
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {isError && (
        <Alert severity="error" sx={{ mb: 2 }}>
          Failed to load materials
        </Alert>
      )}

      {isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {materials.map((material) => (
            <Grid item xs={12} sm={6} md={4} key={material.id}>
              <TaskCard
                material={material}
                onDelete={() => material.id && handleDelete(material.id)}
                onGenerate={() => material.id && handleGenerate(material.id)}
                generating={material.id === generatingId}
                deleting={material.id === deletingId}
              />
            </Grid>
          ))}
          {materials.length === 0 && (
            <Grid item xs={12}>
              <Typography variant="body1" color="text.secondary" textAlign="center" py={4}>
                No materials found. Create your first material!
              </Typography>
            </Grid>
          )}
        </Grid>
      )}

      <MaterialDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onSubmit={handleCreate}
      />
    </Container>
  );
};

export default TasksPage;
