import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Box,
  CircularProgress
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AutoFixHighIcon from '@mui/icons-material/AutoFixHigh';
import { Material } from '../types/material';

interface TaskCardProps {
  material: Material;
  onDelete: () => void;
  onGenerate: () => void;
  generating: boolean;
  deleting: boolean;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  material,
  onDelete,
  onGenerate,
  generating,
  deleting
}) => {
  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!material.id) {
      console.error('Cannot delete material without id');
      return;
    }
    if (window.confirm('Are you sure you want to delete this material?')) {
      onDelete();
    }
  };

  const handleGenerate = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!material.id) {
      console.error('Cannot generate content for material without id');
      return;
    }
    onGenerate();
  };

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <CardContent sx={{ flexGrow: 1 }}>
        <Typography variant="h6" gutterBottom>
          {material.subject}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Grade: {material.grade}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Unit: {material.lessonUnit}
        </Typography>
        <Typography color="text.secondary" gutterBottom>
          Type: {material.materialType}
        </Typography>
        {material.generatedContent ? (
          <Typography 
            variant="body2" 
            sx={{ 
              mt: 2,
              maxHeight: 150,
              overflow: 'auto',
              whiteSpace: 'pre-wrap'
            }}
          >
            {material.generatedContent}
          </Typography>
        ) : (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mt: 2 }}
          >
            No content generated yet. Click "Generate" to create content.
          </Typography>
        )}
      </CardContent>
      <CardActions>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
          <Button
            size="small"
            color="error"
            startIcon={deleting ? <CircularProgress size={20} color="error" /> : <DeleteIcon />}
            onClick={handleDelete}
            disabled={deleting || !material.id}
          >
            {deleting ? 'Deleting...' : 'Delete'}
          </Button>
          <Button
            size="small"
            color="primary"
            startIcon={generating ? <CircularProgress size={20} /> : <AutoFixHighIcon />}
            onClick={handleGenerate}
            disabled={generating || !material.id}
          >
            {generating ? 'Generating...' : 'Generate'}
          </Button>
        </Box>
      </CardActions>
    </Card>
  );
};
