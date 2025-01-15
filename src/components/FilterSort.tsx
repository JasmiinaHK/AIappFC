import React from 'react';
import {
  Box,
  TextField,
  MenuItem,
  IconButton,
  Tooltip,
  Stack,
  Paper,
  Typography
} from '@mui/material';
import {
  Sort as SortIcon,
  SortByAlpha as SortByAlphaIcon,
  FilterList as FilterListIcon
} from '@mui/icons-material';
import { MaterialFilters, SortConfig, Material } from '../types/material';

interface FilterSortProps {
  field: keyof Material;
  onFieldChange: (field: keyof Material) => void;
  direction: 'ASC' | 'DESC';
  onDirectionChange: (direction: 'ASC' | 'DESC') => void;
  filters: MaterialFilters;
  onFiltersChange: (filters: MaterialFilters) => void;
}

const grades = ['1', '2', '3', '4', '5', '6', '7', '8', '9'];
const materialTypes = ['Test', 'Creative Material'];
const languages = ['English', 'Bosnian'];
const sortableFields: Array<{ field: keyof Material; label: string }> = [
  { field: 'subject', label: 'Subject' },
  { field: 'grade', label: 'Grade' },
  { field: 'lessonUnit', label: 'Lesson Unit' },
  { field: 'materialType', label: 'Material Type' },
  { field: 'language', label: 'Language' },
  { field: 'createdAt', label: 'Created Date' }
];

export const FilterSort: React.FC<FilterSortProps> = ({
  field,
  onFieldChange,
  direction,
  onDirectionChange,
  filters,
  onFiltersChange
}) => {
  const handleFilterChange = (field: keyof MaterialFilters) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    onFiltersChange({
      ...filters,
      [field]: event.target.value
    });
  };

  const handleSortChange = (field: keyof Material) => {
    onFieldChange(field);
    onDirectionChange(direction === 'ASC' ? 'DESC' : 'ASC');
  };

  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <FilterListIcon /> Filters
        </Typography>
        <Stack direction="row" spacing={2} flexWrap="wrap">
          <TextField
            label="Subject"
            value={filters.subject || ''}
            onChange={handleFilterChange('subject')}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Grade"
            value={filters.grade || ''}
            onChange={handleFilterChange('grade')}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            {grades.map((grade) => (
              <MenuItem key={grade} value={grade}>
                {`${grade}${grade === '1' ? 'st' : grade === '2' ? 'nd' : grade === '3' ? 'rd' : 'th'} Grade`}
              </MenuItem>
            ))}
          </TextField>
          <TextField
            label="Lesson Unit"
            value={filters.lessonUnit || ''}
            onChange={handleFilterChange('lessonUnit')}
            size="small"
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Material Type"
            value={filters.materialType || ''}
            onChange={handleFilterChange('materialType')}
            size="small"
            sx={{ minWidth: 150 }}
          >
            <MenuItem value="">All</MenuItem>
            {materialTypes.map((type) => (
              <MenuItem key={type} value={type}>{type}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            label="Language"
            value={filters.language || ''}
            onChange={handleFilterChange('language')}
            size="small"
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="">All</MenuItem>
            {languages.map((lang) => (
              <MenuItem key={lang} value={lang}>{lang}</MenuItem>
            ))}
          </TextField>
        </Stack>
      </Box>

      <Box>
        <Typography variant="h6" sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
          <SortByAlphaIcon /> Sort By
        </Typography>
        <Stack direction="row" spacing={1} flexWrap="wrap">
          {sortableFields.map(({ field, label }) => (
            <Tooltip
              key={field}
              title={`Sort by ${label} ${
                field === field
                  ? direction === 'ASC'
                    ? '(ascending)'
                    : '(descending)'
                  : ''
              }`}
            >
              <IconButton
                onClick={() => handleSortChange(field)}
                color={field === field ? 'primary' : 'default'}
                size="small"
              >
                <Box sx={{ 
                  display: 'flex', 
                  alignItems: 'center',
                  border: theme => `1px solid ${field === field ? theme.palette.primary.main : theme.palette.divider}`,
                  borderRadius: 1,
                  px: 1,
                  py: 0.5
                }}>
                  <Typography variant="body2" sx={{ mr: 1 }}>{label}</Typography>
                  <SortIcon
                    sx={{
                      transform: field === field && direction === 'DESC'
                        ? 'rotate(180deg)'
                        : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </Box>
              </IconButton>
            </Tooltip>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
};
