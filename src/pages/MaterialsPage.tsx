import React, { useState, useEffect } from 'react';
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
import { getMaterials, createMaterial, deleteMaterial, generateContent } from '../API/materialApi';
import { Material } from '../types/material';
import { TaskCard } from '../components/TaskCard';

export const MaterialsPage: React.FC = () => {
  const navigate = useNavigate();
  const [materials, setMaterials] = useState<Material[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [generatingId, setGeneratingId] = useState<number | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  
  const email = localStorage.getItem('email');

  useEffect(() => {
    if (!email) {
      navigate('/login');
      return;
    }
    
    loadMaterials();
  }, [email, navigate]);

  const loadMaterials = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getMaterials(email!);
      setMaterials(data.content);
    } catch (err) {
      console.error('Error loading materials:', err);
      setError('Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (material: Omit<Material, 'id' | 'generatedContent'>) => {
    try {
      setError(null);
      const newMaterial = await createMaterial(material);
      console.log('Created material:', newMaterial);
      await loadMaterials(); // Reload all materials to ensure we have the latest state
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
      await loadMaterials(); // Reload materials after deletion
    } catch (error) {
      console.error('Error deleting material:', error);
      setError('Failed to delete material');
    } finally {
      setDeletingId(null);
    }
  };

  const handleGenerate = async (id: number) => {
    if (!id) return;
    try {
      setError(null);
      setGeneratingId(id);
      const material = materials.find(m => m.id === id);
      if (!material) {
        throw new Error('Material not found');
      }
      // Only send necessary fields
      const materialToGenerate = {
        subject: material.subject,
        grade: material.grade,
        lessonUnit: material.lessonUnit,
        materialType: material.materialType,
        language: material.language,
        userEmail: material.userEmail
      };
      await generateContent(id, materialToGenerate as Material);
      await loadMaterials(); // Reload materials to get the generated content
    } catch (err) {
      console.error('Error generating content:', err);
      setError('Failed to generate content');
    } finally {
      setGeneratingId(null);
    }
  };

  if (!email) {
    return null;
  }

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

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Grid container spacing={3}>
          {materials.map((material) => (
            <Grid item xs={12} sm={6} md={4} key={material.id}>
              <TaskCard
                material={material}
                onDelete={() => material.id !== undefined ? handleDelete(material.id) : undefined}
                onGenerate={() => material.id !== undefined ? handleGenerate(material.id) : undefined}
                generating={material.id === generatingId}
                deleting={material.id === deletingId}
              />
            </Grid>
          ))}
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

export default MaterialsPage;
