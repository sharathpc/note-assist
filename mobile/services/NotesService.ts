import axios from 'axios';

import { API_URL } from '@/constants/Variables';
import { INote } from '@/models';

export const getNotes = async (userId: string): Promise<INote[]> => {
  try {
    const response = await axios.get(`${API_URL}/api/notes`, {
      headers: { 'User-Id': userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error while fetching notes:', error);
    throw error;
  }
};

export const getNote = async (
  userId: string,
  noteId: string
): Promise<INote> => {
  try {
    const response = await axios.get(`${API_URL}/api/notes/${noteId}`, {
      headers: { 'User-Id': userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error while fetching notes:', error);
    throw error;
  }
};

export const createNote = async (
  userId: string,
  payload: {
    title: string;
    content: string;
    status: string;
  }
): Promise<INote> => {
  try {
    const response = await axios.post(`${API_URL}/api/notes`, payload, {
      headers: { 'User-Id': userId },
    });
    return response.data;
  } catch (error) {
    console.error('Error while creating note:', error);
    throw error;
  }
};

export const updateNote = async (
  userId: string,
  noteId: string,
  payload: {
    title: string;
    content: string;
    status: string;
  }
): Promise<INote> => {
  try {
    const response = await axios.put(
      `${API_URL}/api/notes/${noteId}`,
      payload,
      {
        headers: { 'User-Id': userId },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error while updating note:', error);
    throw error;
  }
};

export const deleteNote = async (
  userId: string,
  noteId: string
): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/api/notes/${noteId}`, {
      headers: { 'User-Id': userId },
    });
  } catch (error) {
    console.error('Error while deleting note:', error);
    throw error;
  }
};
