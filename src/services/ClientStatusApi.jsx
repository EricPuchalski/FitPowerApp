// src/services/api.js
import axios from 'axios';

const API_URL = 'http://localhost:8080/api/clients';

export const getClientStatuses = async (clientId) => {
  try {
    const response = await axios.get(`${API_URL}/${clientId}/statuses`);
    return response.data;
  } catch (error) {
    console.error('Error fetching client statuses:', error);
    throw error;
  }
};
