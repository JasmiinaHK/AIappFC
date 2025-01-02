import React from 'react';
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  ListItemSecondaryAction,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { Task as TaskType } from '../types/task';

interface TaskProps {
  task: TaskType;
  onToggle: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

const Task: React.FC<TaskProps> = ({ task, onToggle, onDelete }) => {
  return (
    <ListItem>
      <Checkbox
        edge="start"
        checked={task.completed}
        onChange={() => onToggle(task.id)}
      />
      <ListItemText
        primary={task.subject}
        sx={{
          textDecoration: task.completed ? 'line-through' : 'none',
        }}
      />
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          aria-label="delete"
          onClick={() => onDelete(task.id)}
        >
          <DeleteIcon />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

export default Task;
