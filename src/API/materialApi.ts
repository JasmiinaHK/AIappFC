import axios from 'axios';
import { Material } from '../types/material';

const API_URL = 'http://localhost:8080/api'; // Added /api prefix to match Spring Boot controller mapping

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Get all materials
export const getAllMaterials = async (): Promise<Material[]> => {
  try {
    const response = await api.get('/materials');
    return response.data;
  } catch (error) {
    console.error('Error fetching materials:', error);
    throw error;
  }
};

// Get materials by category
export const getMaterialsByCategory = async (categoryId: number): Promise<Material[]> => {
  try {
    const response = await api.get(`/materials/category/${categoryId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching materials by category:', error);
    throw error;
  }
};
