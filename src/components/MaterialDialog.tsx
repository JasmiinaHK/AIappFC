import React, { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  MenuItem,
  Alert,
  Stack
} from '@mui/material';
import { Material } from '../types/material';

interface MaterialDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>, generateContent: boolean) => void;
  userEmail?: string;
  loading?: boolean;
}

interface FormData {
  subject: string;
  grade: string;
  lessonUnit: string;
  materialType: Material['materialType'] | '';
  language: string;
}

const gradeOptions = ['1st', '2nd', '3rd', '4th', '5th', '6th', '7th', '8th', '9th'];
const materialTypes: Material['materialType'][] = ['Test', 'Creative Task'];

const MaterialDialog: React.FC<MaterialDialogProps> = ({
  open,
  onClose,
  onSubmit,
  userEmail = '',
  loading = false
}) => {
  const [formData, setFormData] = useState<FormData>({
    subject: '',
    grade: '',
    lessonUnit: '',
    materialType: '',
    language: 'English'
  });

  const handleChange = (name: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = (generateContent: boolean) => {
    if (formData.materialType === '') return;
    
    onSubmit({
      subject: formData.subject,
      grade: formData.grade,
      lessonUnit: formData.lessonUnit,
      materialType: formData.materialType as Material['materialType'],
      language: formData.language,
      userEmail,
      content: undefined
    }, generateContent);

    setFormData({
      subject: '',
      grade: '',
      lessonUnit: '',
      materialType: '',
      language: 'English'
    });
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle sx={{ 
        bgcolor: '#0072ff', 
        color: 'white', 
        fontWeight: 700 
      }}>
        Create New Task
      </DialogTitle>
      <DialogContent>
        <Box component="form" sx={{ mt: 2 }}>
          <TextField
            name="subject"
            label="Subject"
            value={formData.subject}
            onChange={(e) => handleChange('subject', e.target.value)}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            name="grade"
            label="Grade"
            value={formData.grade}
            onChange={(e) => handleChange('grade', e.target.value)}
            select
            fullWidth
            margin="normal"
            required
          >
            {gradeOptions.map((grade) => (
              <MenuItem key={grade} value={grade}>
                {grade}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            name="lessonUnit"
            label="Topic / Lesson Unit"
            value={formData.lessonUnit}
            onChange={(e) => handleChange('lessonUnit', e.target.value)}
            fullWidth
            margin="normal"
            required
            placeholder="e.g., Algebra, Geometry, Literature"
          />
          <TextField
            select
            label="Material Type"
            value={formData.materialType}
            onChange={(e) => handleChange('materialType', e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="Test">Test</MenuItem>
            <MenuItem value="Creative Task">Creative Task</MenuItem>
          </TextField>
          <TextField
            select
            label="Language"
            value={formData.language}
            onChange={(e) => handleChange('language', e.target.value)}
            fullWidth
            margin="normal"
          >
            <MenuItem value="English">English</MenuItem>
            <MenuItem value="Bosnian">Bosnian</MenuItem>
          </TextField>
        </Box>
      </DialogContent>
      <DialogActions sx={{ p: 2, justifyContent: 'space-between' }}>
        <Button onClick={onClose} color="inherit">
          Cancel
        </Button>
        <Box>
          <Button 
            onClick={() => handleSave(false)} 
            color="primary" 
            variant="outlined" 
            sx={{ mr: 1 }}
            disabled={loading || !formData.subject || !formData.grade || !formData.materialType || !formData.lessonUnit}
          >
            Save Only
          </Button>
          <Button 
            onClick={() => handleSave(true)} 
            color="primary" 
            variant="contained"
            disabled={loading || !formData.subject || !formData.grade || !formData.materialType || !formData.lessonUnit}
            startIcon={loading && <CircularProgress size={20} color="inherit" />}
          >
            Save & Generate
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
};

export default MaterialDialog;
