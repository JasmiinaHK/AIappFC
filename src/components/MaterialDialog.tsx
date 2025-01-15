import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  SelectChangeEvent
} from '@mui/material';
import { Material } from '../types/material';

interface MaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (material: Omit<Material, 'id' | 'generatedContent'>) => void;
}

export const MaterialDialog: React.FC<MaterialDialogProps> = ({
  open,
  onClose,
  onSubmit
}) => {
  const [formData, setFormData] = useState({
    subject: '',
    grade: '',
    lessonUnit: '',
    materialType: '',
    language: '',
    userEmail: localStorage.getItem('email') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSelectChange = (e: SelectChangeEvent<string>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <form onSubmit={handleSubmit}>
        <DialogTitle>Create New Material</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              fullWidth
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleTextChange}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Grade</InputLabel>
              <Select
                name="grade"
                value={formData.grade}
                label="Grade"
                onChange={handleSelectChange}
              >
                <MenuItem value="1st">1st Grade</MenuItem>
                <MenuItem value="2nd">2nd Grade</MenuItem>
                <MenuItem value="3rd">3rd Grade</MenuItem>
                <MenuItem value="4th">4th Grade</MenuItem>
                <MenuItem value="5th">5th Grade</MenuItem>
                <MenuItem value="6th">6th Grade</MenuItem>
                <MenuItem value="7th">7th Grade</MenuItem>
                <MenuItem value="8th">8th Grade</MenuItem>
                <MenuItem value="9th">9th Grade</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="Lesson Unit"
              name="lessonUnit"
              value={formData.lessonUnit}
              onChange={handleTextChange}
              required
            />

            <FormControl fullWidth required>
              <InputLabel>Material Type</InputLabel>
              <Select
                name="materialType"
                value={formData.materialType}
                label="Material Type"
                onChange={handleSelectChange}
              >
                <MenuItem value="creative">Creative Material</MenuItem>
                <MenuItem value="test">Test</MenuItem>
              </Select>
            </FormControl>

            <FormControl fullWidth required>
              <InputLabel>Language</InputLabel>
              <Select
                name="language"
                value={formData.language}
                label="Language"
                onChange={handleSelectChange}
              >
                <MenuItem value="english">English</MenuItem>
                <MenuItem value="bosnian">Bosnian</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" variant="contained">Save</Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
