import axios from 'axios';
import { Material, PaginatedResponse } from '../types/material';
import { API_URL } from '../config';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  },
  timeout: 10000 // 10 seconds timeout
});

// Add request interceptor to log requests
api.interceptors.request.use(request => {
  console.log('Starting Request:', {
    url: request.url,
    method: request.method,
    data: request.data
  });
  return request;
});

// Add response interceptor to log responses
api.interceptors.response.use(
  response => {
    console.log('Response:', {
      status: response.status,
      data: response.data
    });
    return response;
  },
  error => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status
    });
    return Promise.reject(error);
  }
);

export const getMaterials = async (email: string): Promise<PaginatedResponse<Material>> => {
  try {
    console.log('Attempting to fetch materials with email:', email);
    // First try the paginated endpoint
    const response = await api.get<PaginatedResponse<Material>>(`/api/materials`, {
      params: {
        userEmail: email,
        page: 0,
        size: 10,
        sortBy: 'createdAt',
        sortDirection: 'DESC'
      }
    });
    console.log('Successfully fetched materials:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching materials from paginated endpoint:', error.response?.data || error.message);
    console.log('Attempting fallback endpoint...');
    try {
      // Fallback to the user-specific endpoint
      const fallbackResponse = await api.get<Material[]>(`/api/materials/user/${encodeURIComponent(email)}`);
      console.log('Successfully fetched materials from fallback endpoint:', fallbackResponse.data);
      return {
        content: fallbackResponse.data,
        totalElements: fallbackResponse.data.length,
        totalPages: 1,
        size: fallbackResponse.data.length,
        number: 0
      };
    } catch (fallbackError: any) {
      console.error('Error fetching materials from fallback endpoint:', fallbackError.response?.data || fallbackError.message);
      throw fallbackError;
    }
  }
};

export const createMaterial = async (material: Omit<Material, 'id' | 'generatedContent'>): Promise<Material> => {
  try {
    console.log('Creating material:', material);
    const response = await api.post<Material>('/api/materials', material);
    console.log('Create response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Error creating material:', error);
    throw error;
  }
};

export const deleteMaterial = async (id: number, userEmail: string): Promise<void> => {
  try {
    console.log('Deleting material with ID:', id, 'for user:', userEmail);
    const response = await api.delete(`/api/materials/${id}`, {
      params: { userEmail }
    });
    console.log('Delete response:', response.status);
  } catch (error: any) {
    console.error('Error deleting material:', error.response?.data || error.message);
    throw error;
  }
};

export const generateContent = async (id: number, material: Material): Promise<Material> => {
  try {
    console.log('Generating content for material:', id, material);
    const response = await api.post<Material>(`/api/materials/${id}/generate`, material);
    console.log('Generate content response:', response.data);
    return response.data;
  } catch (error: any) {
    console.error('Error generating content:', error.response?.data || error.message);
    throw error;
  }
};
