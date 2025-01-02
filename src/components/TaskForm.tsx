import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';

const TaskForm: React.FC = () => {
  const [task, setTask] = useState({
    subject: '',
    description: '',
  });

  // Funkcija za rukovanje promenama input polja
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  // Funkcija za slanje podataka kada se forma pošalje
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Task created:', task); // Ovdje možete dodati logiku za slanje zadatka na backend
  };

  return (
    <Box display="flex" flexDirection="column" gap={2} alignItems="center">
      <h2>Create Task</h2>
      <form onSubmit={handleSubmit} style={{ width: '100%', maxWidth: 400 }}>
        <TextField
          label="Subject"
          name="subject"
          value={task.subject}
          onChange={handleChange}
          fullWidth
          required
        />
        <TextField
          label="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
          fullWidth
          required
          multiline
          rows={4}
        />
        <Button
          type="submit"
          variant="contained"
          color="primary"
          style={{ marginTop: '16px' }}
        >
          Submit
        </Button>
      </form>
    </Box>
  );
};

export default TaskForm;
