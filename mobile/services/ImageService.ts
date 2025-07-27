import axios from 'axios';

import { API_URL } from '@/constants/Variables';

export const uploadImage = async (
  userId: string,
  formData: FormData
): Promise<{ url: string }> => {
  try {
    const response = await axios.post(`${API_URL}/api/images`, formData, {
      headers: {
        'User-Id': userId,
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error while uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (
  userId: string,
  noteId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/images/${noteId}`, {
      headers: { 'User-Id': userId },
    });
  } catch (error) {
    console.error('Error while deleting image:', error);
    throw error;
  }
};
