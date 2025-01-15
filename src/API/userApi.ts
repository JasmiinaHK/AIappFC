import axios from 'axios';
import { API_URL } from '../config';
import { User } from '../types/user';

// User-related API endpoints
const userEndpoints = {
  login: `${API_URL}/api/users/login`,
  register: `${API_URL}/api/users/register`,
  // Add other endpoints as needed
  getUserByEmail: `${API_URL}/users/email/`,
  createUser: `${API_URL}/users`,
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const getUserByEmail = async (email: string): Promise<User> => {
  try {
    const response = await api.get(`${userEndpoints.getUserByEmail}${email}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};

export const createUser = async (user: Omit<User, 'id'>): Promise<User> => {
  try {
    const response = await api.post(userEndpoints.createUser, user);
    return response.data;
  } catch (error) {
    console.error('Error creating user:', error);
    if (axios.isAxiosError(error)) {
      console.error('Response:', error.response?.data);
      console.error('Status:', error.response?.status);
    }
    throw error;
  }
};
