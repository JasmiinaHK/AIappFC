import axios from 'axios';
import { Material } from '../types/material';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getTasks = async (email: string): Promise<Material[]> => {
  console.log('Getting tasks for email:', email);
  try {
    const response = await api.get(`/tasks/user/${email}`);
    console.log('Tasks received:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error fetching tasks:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

export const createTask = async (material: Omit<Material, 'id' | 'createdAt' | 'updatedAt'>): Promise<Material> => {
  try {
    const response = await api.post('/tasks', material);
    return response.data;
  } catch (error) {
    console.error('Error creating task:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

export const generateContent = async (taskId: string): Promise<Material> => {
  try {
    const response = await api.post(`/tasks/${taskId}/generate`);
    return response.data;
  } catch (error) {
    console.error('Error generating content:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

export const updateTask = async (taskId: string, updates: Partial<Material>): Promise<Material> => {
  try {
    const response = await api.put(`/tasks/${taskId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating task:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

export const deleteTask = async (taskId: string): Promise<void> => {
  try {
    await api.delete(`/tasks/${taskId}`);
  } catch (error) {
    console.error('Error deleting task:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};