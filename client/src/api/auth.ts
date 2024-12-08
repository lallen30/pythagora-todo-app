import api from './api';

// Login
// POST /auth/login
// Request: { email: string, password: string }
// Response: { success: boolean, message: string, token: string }
export const login = async (email: string, password: string) => {
  try {
    const response = await api.post('/auth/login', { email, password });
    console.log('Login successful:', response);
    return response; // Return the entire response object
  } catch (error) {
    console.error('Login error:', error);
    throw error;
  }
};

// Register
// POST /auth/register
// Request: { email: string, password: string }
// Response: { success: boolean, message: string, token: string }
export const register = async (data: { email: string; password: string }) => {
  try {
    const response = await api.post('/auth/register', data);
    console.log('Registration successful:', response);
    return response; // Return the entire response object
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

// Logout
// POST /auth/logout
// Response: { success: boolean, message: string }
export const logout = () => {
    return api.post('/auth/logout').then(response => {
      console.log('Logout successful:', response);
      return response; // Return the entire response object
    }).catch(error => {
      console.error('Logout error:', error);
      throw error;
    });
};