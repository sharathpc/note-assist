import axios from 'axios';

import { API_URL } from '@/constants/Variables';
import { IUser } from '@/models';

export const login = async (payload: {
  email: string;
  password: string;
}): Promise<IUser> => {
  try {
    const response = await axios.post(`${API_URL}/api/users/login`, payload);
    return response.data;
  } catch (error) {
    console.error('Error while logging in:', error);
    throw error;
  }
};

export const register = async (payload: {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}): Promise<IUser> => {
  try {
    const response = await axios.post(`${API_URL}/api/users/register`, payload);
    return response.data;
  } catch (error) {
    console.error('Error while registering:', error);
    throw error;
  }
};
