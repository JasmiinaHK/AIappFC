import axios from 'axios';
import { API_URL, DEFAULT_HEADERS } from '../config';
import { User } from '../types/user';

const api = axios.create({
  baseURL: API_URL,
  headers: DEFAULT_HEADERS
});

interface LoginResponse {
  user: User;
  token?: string;
}

export const login = async (email: string): Promise<User> => {
  try {
    // First try to get the user
    const response = await api.post<LoginResponse>('/api/v1/auth/login', { 
      email,
      name: email.split('@')[0] // Use part before @ as name
    });
    
    if (response.data.user) {
      localStorage.setItem('email', email);
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      return response.data.user;
    }
    throw new Error('User not found');
  } catch (error) {
    // If user doesn't exist, try to register them
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      try {
        const registerResponse = await api.post<LoginResponse>('/api/v1/auth/register', { 
          email,
          name: email.split('@')[0] // Use part before @ as name
        });
        
        if (registerResponse.data.user) {
          localStorage.setItem('email', email);
          if (registerResponse.data.token) {
            localStorage.setItem('token', registerResponse.data.token);
          }
          return registerResponse.data.user;
        }
        throw new Error('Failed to register user');
      } catch (registerError) {
        console.error('Registration error:', registerError);
        throw new Error('Failed to login or register. Please try again.');
      }
    } else {
      throw error;
    }
  }
};
