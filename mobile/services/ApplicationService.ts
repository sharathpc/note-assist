import axios from 'axios';

import { API_URL } from '@/constants/Variables';

interface AgentParameters {
  portfolioId: string;
  platform: string;
  platformId: number;
  userName: string;
  threadId: string;
}

export const AgentService = {
  /**
   * Transcribe audio to text
   * @param formData - The user's audio data
   */
  transcribeAudio: async (formData: FormData): Promise<any> => {
    try {
      const response = await axios.post(`${API_URL}/api/transcribe`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error communicating with agent:', error);
      throw error;
    }
  },

  /**
   * Communicate with the AI agent
   * @param message - The user's message
   * @param parameters - Optional parameters needed by tools
   */
  sendMessage: async (
    message: string,
    parameters: AgentParameters
  ): Promise<{
    content: string;
    threadId: string;
    status: string;
  }> => {
    try {
      const response = await axios.post(`${API_URL}/api/agent`, {
        message,
        threadId: parameters.threadId,
        portfolioId: parameters.portfolioId,
        platform: parameters.platform,
        platformId: parameters.platformId,
        userName: parameters.userName,
      });
      return {
        content: response.data.content,
        threadId: response.data.threadId,
        status: 'success',
      };
    } catch (error) {
      console.error('Error communicating with agent:', error);
      throw error;
    }
  },
};
