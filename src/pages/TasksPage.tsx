import React, { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTasks } from '../hooks/useTasks';
import { Material } from '../types/material';
import { 
  CircularProgress, 
  Box, 
  Typography, 
  Paper,
  Alert,
  Button,
  Card,
  CardContent,
  CardActions,
  Stack,
  Grid,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import MaterialDialog from '../components/MaterialDialog';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createTask, deleteTask, generateContent } from '../API/taskApi';

const TasksPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const email = searchParams.get('email') || '';
  const { data: tasks, isLoading, error } = useTasks(email);
  const queryClient = useQueryClient();

  const createTaskMutation = useMutation(
    (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>) =>
      createTask(material),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', email]);
        setDialogOpen(false);
        setErrorMessage(null);
      },
      onError: (error) => {
        console.error('Error creating task:', error);
        if (error instanceof Error) {
          setErrorMessage(error.message);
        } else {
          setErrorMessage('Failed to create task');
        }
      }
    }
  );

  const deleteTaskMutation = useMutation(
    (taskId: string) => deleteTask(taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', email]);
      }
    }
  );

  const generateContentMutation = useMutation(
    (taskId: string) => generateContent(taskId),
    {
      onSuccess: () => {
        queryClient.invalidateQueries(['tasks', email]);
      }
    }
  );

  const handleCreateTask = async (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>, generateNow: boolean) => {
    try {
      console.log('Creating task with data:', material);
      const task = await createTaskMutation.mutateAsync({
        ...material,
        userEmail: email
      });
      console.log('Task created:', task);
      
      if (generateNow && task.id) {
        console.log('Generating content for task:', task.id);
        await generateContentMutation.mutateAsync(task.id);
      }
    } catch (error) {
      console.error('Error in handleCreateTask:', error);
      if (error instanceof Error) {
        setErrorMessage(error.message);
      } else {
        setErrorMessage('Failed to create task');
      }
    }
  };

  if (isLoading) return <LoadingSpinner />;
  
  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">
          Error loading tasks: {error instanceof Error ? error.message : 'Unknown error'}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      background: 'linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)',
      p: 3
    }}>
      <Paper elevation={3} sx={{ 
        p: 3, 
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.95)'
      }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" component="h1" sx={{ 
            color: '#1a237e',
            fontWeight: 700,
            textShadow: '1px 1px 1px rgba(0,0,0,0.1)'
          }}>
            {email ? `${email.split('@')[0]}'s Tasks` : 'Tasks'}
          </Typography>
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={() => setDialogOpen(true)}
            sx={{
              bgcolor: '#0072ff',
              '&:hover': {
                bgcolor: '#005bb5',
              },
              borderRadius: 2,
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}
          >
            Create Task
          </Button>
        </Stack>

        {tasks && tasks.length > 0 ? (
          <Grid container spacing={3}>
            {tasks.map((task) => (
              <Grid item xs={12} sm={6} md={4} key={task.id}>
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
                        onClick={() => task.id && generateContentMutation.mutate(task.id)}
                        disabled={generateContentMutation.isLoading}
                        sx={{
                          mr: 1,
                          bgcolor: '#0072ff',
                          '&:hover': {
                            bgcolor: '#005bb5',
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
                      onClick={() => task.id && deleteTaskMutation.mutate(task.id)}
                      sx={{
                        borderColor: 'error.main',
                        '&:hover': {
                          bgcolor: 'error.main',
                          color: 'white'
                        }
                      }}
                    >
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        ) : (
          <Paper 
            elevation={0}
            sx={{ 
              p: 4, 
              textAlign: 'center',
              bgcolor: 'rgba(0,114,255,0.05)',
              borderRadius: 2,
              border: '1px dashed rgba(0,114,255,0.2)'
            }}
          >
            <Typography color="textSecondary">
              No tasks found. Create one to get started!
            </Typography>
          </Paper>
        )}

        <MaterialDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleCreateTask}
          loading={createTaskMutation.isLoading || generateContentMutation.isLoading}
          userEmail={email}
        />

        <Snackbar
          open={!!errorMessage}
          autoHideDuration={6000}
          onClose={() => setErrorMessage(null)}
          message={errorMessage}
        >
          <Alert severity="error" onClose={() => setErrorMessage(null)}>
            {errorMessage}
          </Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
};

const LoadingSpinner = () => (
  <Box 
    display="flex" 
    justifyContent="center" 
    alignItems="center" 
    minHeight="200px"
    sx={{ color: '#0072ff' }}
  >
    <CircularProgress />
  </Box>
);

export default TasksPage;
