// src/hooks/useAuth.ts
import { useState, useEffect } from 'react';
import authService from '../service/AuthService';

export interface AuthUser {
  token: string;
  username: string;
  dni: string;
  email: string;
  roles: string[];
  trainerData?: {
    id: number;
    name: string;
    gymName: string;
    dni: string;
    email: string;
    specialization?: string;
    active: boolean;
  };
  nutritionistData?: {
    id: number;
    name: string;
    gymName: string;
    dni: string;
    email: string;
    specialization?: string;
    active: boolean;
  };
  clientData?: {
    id: number;
    name: string;
    gymName: string;
    dni: string;
    email: string;
    dateOfBirth?: string;
    active: boolean;
  };
}

export const useAuth = () => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = () => {
    try {
      const currentUser = authService.getCurrentUser();
      const isAuth = authService.isAuthenticated();
      
      setUser(currentUser);
      setIsAuthenticated(isAuth);
      
      if (!isAuth && currentUser) {
        // Token expirado, limpiar datos
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    setLoading(true);
    try {
      const userData = await authService.login({ username, password });
      setUser(userData);
      setIsAuthenticated(true);
      return userData;
    } catch (error) {
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
    setIsAuthenticated(false);
  };

  // Métodos de conveniencia para verificar roles
  const isTrainer = () => authService.isTrainer();
  const isNutritionist = () => authService.isNutritionist();
  const isClient = () => authService.isClient();
  const isAdmin = () => authService.isAdmin();

  // Obtener datos específicos según el rol
  const getTrainerData = () => authService.getTrainerData();
  const getNutritionistData = () => authService.getNutritionistData();
  const getClientData = () => authService.getClientData();

  // Obtener headers de autorización
  const getAuthHeaders = () => authService.getAuthHeader();

  // Métodos para obtener datos del token directamente
  const getTokenData = () => authService.getTokenData();
  const getUserDni = () => authService.getUserDni();
  const getUserEmail = () => authService.getUserEmail();
  const getUsername = () => authService.getUsername();
  const getUserRole = () => authService.getUserRole();

  return {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    checkAuthStatus,
    // Métodos de roles
    isTrainer,
    isNutritionist,
    isClient,
    isAdmin,
    // Métodos para obtener datos específicos
    getTrainerData,
    getNutritionistData,
    getClientData,
    // Headers
    getAuthHeaders,
    // Métodos para obtener datos del token
    getTokenData,
    getUserDni,
    getUserEmail,
    getUsername,
    getUserRole
  };
};