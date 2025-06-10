// auth/authService.js
import axios from 'axios';
import { jwtDecode } from 'jwt-decode'; // Para decodificar el JWT

const API_URL = 'http://tu-backend.com/api/auth';

const authService = {
  async login(username: any, password: any) {
    const response = await axios.post(`${API_URL}/login`, { username, password });
    
    if (response.data.token) {
      const decodedToken = jwtDecode(response.data.token);
      const userData = {
        ...response.data,
        role: decodedToken.role, // Asumiendo que el rol está en el token
        userId: decodedToken.sub
      };
      localStorage.setItem('user', JSON.stringify(userData));
    }
    
    return response.data;
  },

  logout() {
    localStorage.removeItem('user');
  },

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  },

  getAuthHeader() {
    const user = this.getCurrentUser();
    return user?.token ? { Authorization: `Bearer ${user.token}` } : {};
  }
};

export default authService;