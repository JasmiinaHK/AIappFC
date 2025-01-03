import React from 'react';
import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Button,
  Stack
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Material } from '../types/material';

interface TaskCardProps {
  task: Material;
  onDelete: (taskId: string) => void;
  onGenerateContent: (taskId: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onDelete, onGenerateContent }) => {
  return (
    <Card sx={{ 
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      borderRadius: 2,
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.12)'
      }
    }}>
      <CardContent sx={{ flexGrow: 1, p: 3 }}>
        <Typography variant="h6" component="h2" gutterBottom sx={{ 
          color: '#1a237e',
          fontWeight: 600
        }}>
          {task.subject}
        </Typography>
        <Stack spacing={1}>
          <Typography variant="body2" color="textSecondary">
            <strong>Grade:</strong> {task.grade}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Topic:</strong> {task.lessonUnit}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            <strong>Type:</strong> {task.materialType}
          </Typography>
        </Stack>
        {task.content && (
          <Typography 
            variant="body1" 
            sx={{ 
              mt: 2,
              p: 2,
              bgcolor: 'rgba(0,114,255,0.05)',
              borderRadius: 1,
              border: '1px solid rgba(0,114,255,0.1)'
            }}
          >
            {task.content}
          </Typography>
        )}
      </CardContent>
      <CardActions sx={{ 
        p: 2, 
        borderTop: '1px solid rgba(0,0,0,0.08)',
        bgcolor: 'rgba(0,0,0,0.02)'
      }}>
        {!task.content && (
          <Button
            variant="contained"
            color="primary"
            size="small"
            onClick={() => task.id && onGenerateContent(task.id)}
            sx={{
              bgcolor: '#0072ff',
              '&:hover': {
                bgcolor: '#005bb5'
              }
            }}
          >
            Generate Content
          </Button>
        )}
        <Button
          variant="outlined"
          color="error"
          size="small"
          startIcon={<DeleteIcon />}
          onClick={() => task.id && onDelete(task.id)}
          sx={{ ml: 'auto' }}
        >
          Delete
        </Button>
      </CardActions>
    </Card>
  );
};

export default TaskCard;
