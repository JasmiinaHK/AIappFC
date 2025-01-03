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
  Grid,
  Stack,
  Snackbar
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import MaterialDialog from '../components/MaterialDialog';
import TaskCard from '../components/TaskCard';
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

  if (isLoading) return <CircularProgress />;

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
                <TaskCard
                  task={task}
                  onDelete={(taskId) => deleteTaskMutation.mutate(taskId)}
                  onGenerateContent={(taskId) => generateContentMutation.mutate(taskId)}
                />
              </Grid>
            ))}
          </Grid>
        ) : (
          <Typography variant="body1" color="textSecondary" align="center">
            No tasks found. Create one to get started!
          </Typography>
        )}
      </Paper>

      <MaterialDialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setErrorMessage(null);
        }}
        onSubmit={handleCreateTask}
      />

      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={() => setErrorMessage(null)}
      >
        <Alert severity="error" onClose={() => setErrorMessage(null)}>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default TasksPage;
