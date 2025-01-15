import axios, { AxiosError } from 'axios';
import { Material } from '../types/material';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

interface PaginatedResponse<T> {
  items: T[];
  totalItems: number;
  totalPages: number;
  currentPage: number;
}

interface APIError {
  message: string;
  status: number;
}

const handleError = (error: unknown): never => {
  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<APIError>;
    if (axiosError.response?.data) {
      throw new Error(axiosError.response.data.message || 'An error occurred');
    }
    throw new Error(axiosError.message);
  }
  throw error;
};

export const getTasks = async (email: string): Promise<PaginatedResponse<Material>> => {
  try {
    if (!email) {
      throw new Error('Email is required');
    }
    const response = await api.get<PaginatedResponse<Material>>(`/api/materials?userEmail=${encodeURIComponent(email)}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    return handleError(error);
  }
};

export const createTask = async (material: Omit<Material, 'id' | 'generatedContent'>): Promise<Material> => {
  try {
    const response = await api.post<Material>('/api/materials', material);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    return handleError(error);
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/api/materials/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    return handleError(error);
  }
};

export const generateContent = async (taskId: string, userEmail: string, task: Material): Promise<Material> => {
  try {
    console.log('Generating content for task:', { taskId, userEmail, task });
    const response = await api.post<Material>(`/api/materials/${taskId}/generate`, {
      id: taskId,
      subject: task.subject,
      grade: task.grade,
      lessonUnit: task.lessonUnit,
      materialType: task.materialType,
      language: task.language,
      userEmail: userEmail,
      createdAt: task.createdAt,
      updatedAt: new Date().toISOString()
    });
    console.log('Generate content response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    return handleError(error);
  }
};