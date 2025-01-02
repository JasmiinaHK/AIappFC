import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Stack,
  Divider
} from '@mui/material';
import { Material } from '../types/material';

interface TaskDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  task: Material | null;
  onGenerate: (taskId: string) => Promise<void>;
  isGenerating: boolean;
}

const TaskDetailsDialog: React.FC<TaskDetailsDialogProps> = ({
  open,
  onClose,
  task,
  onGenerate,
  isGenerating
}) => {
  if (!task) return null;

  return (
    <Dialog 
      open={open} 
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: '10px',
          bgcolor: 'background.paper',
          boxShadow: 24,
        }
      }}
    >
      <DialogTitle sx={{ bgcolor: '#0072ff', color: 'white', fontWeight: 700 }}>
        Task Details
      </DialogTitle>
      <DialogContent>
        <Box sx={{ py: 2 }}>
          <Typography variant="h6" gutterBottom>
            {task.subject} - Grade {task.grade}
          </Typography>
          <Typography color="textSecondary" gutterBottom>
            Type: {task.materialType}
          </Typography>
          <Typography variant="body2" color="textSecondary" gutterBottom>
            Topic: {task.lessonUnit}
          </Typography>
          <Divider sx={{ my: 2 }} />
          
          {task.content ? (
            <Box sx={{ mt: 2 }}>
              <Typography variant="h6" gutterBottom>
                Content:
              </Typography>
              <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                {task.content}
              </Typography>
            </Box>
          ) : (
            <Box sx={{ mt: 2 }}>
              <Alert severity="info" sx={{ mb: 2 }}>
                Content not generated yet
              </Alert>
              <Button
                variant="contained"
                color="primary"
                onClick={() => task.id && onGenerate(task.id)}
                disabled={isGenerating}
                fullWidth
              >
                {isGenerating ? (
                  <Stack direction="row" spacing={2} alignItems="center">
                    <CircularProgress size={20} color="inherit" />
                    <span>Generating Content...</span>
                  </Stack>
                ) : (
                  'Generate Content'
                )}
              </Button>
            </Box>
          )}
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 3 }}>
        <Button onClick={onClose} variant="outlined">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TaskDetailsDialog;
