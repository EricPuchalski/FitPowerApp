// src/auth/service/AuthService.ts
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { UserRole } from '../model/UserRole';
const API_URL = 'http://localhost:8080/api/v1/auth';
// Enum para los roles
const authService = {
    async login(credentials) {
        try {
            const response = await axios.post(`${API_URL}/signin`, credentials);
            const data = response.data;
            if (data.token) {
                // Limpiar localStorage
                localStorage.clear();
                // Almacenar datos básicos de autenticación
                localStorage.setItem("token", data.token);
                localStorage.setItem("role", data.roles[0]);
                localStorage.setItem("userId", data.id.toString());
                localStorage.setItem("username", data.username);
                localStorage.setItem("userEmail", data.email);
                localStorage.setItem("userDni", data.dni);
                localStorage.setItem("userRole", data.roles[0]);
                localStorage.setItem("gymName", data.gymName);
                let userData = { ...data };
                // Manejo específico según el rol del usuario
                await this.fetchUserRoleData(userData, data.token);
                // Verificar si la cuenta está activa
                if (userData.roles.includes(UserRole.TRAINER)) {
                    if (userData.trainerData && !userData.trainerData.active) {
                        localStorage.clear();
                        throw new Error("Cuenta inhabilitada, por favor contactese con la administración");
                    }
                }
                else if (userData.roles.includes(UserRole.NUTRITIONIST)) {
                    if (userData.nutritionistData && !userData.nutritionistData.active) {
                        localStorage.clear();
                        throw new Error("Cuenta inhabilitada, por favor contactese con la administración");
                    }
                }
                else if (userData.roles.includes(UserRole.CLIENT)) {
                    if (userData.clientData && !userData.clientData.active) {
                        localStorage.clear();
                        throw new Error("Cuenta inhabilitada, por favor contactese con la administración");
                    }
                }
                // Almacenar todos los datos del usuario
                localStorage.setItem('user', JSON.stringify(userData));
                return userData;
            }
            throw new Error(data.message || "Credenciales incorrectas");
        }
        catch (error) {
            console.error("Error al iniciar sesión:", error);
            localStorage.clear();
            if (error.response?.data?.message) {
                throw new Error(error.response.data.message);
            }
            if (error.message) {
                throw error;
            }
            throw new Error("Error de conexión. Por favor, verifique su conexión a internet e intente nuevamente.");
        }
    },
    logout() {
        localStorage.clear();
    },
    getCurrentUser() {
        try {
            const user = localStorage.getItem('user');
            return user ? JSON.parse(user) : null;
        }
        catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem('user');
            return null;
        }
    },
    getAuthHeader() {
        const token = localStorage.getItem('token');
        return token ? { Authorization: `Bearer ${token}` } : {};
    },
    isAuthenticated() {
        const token = localStorage.getItem('token');
        if (!token)
            return false;
        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Date.now() / 1000;
            return decodedToken.exp > currentTime;
        }
        catch (error) {
            console.error("Error decoding token:", error);
            return false;
        }
    },
    getUserRole() {
        return localStorage.getItem('userRole');
    },
    getRedirectPath(roles) {
        if (roles.includes(UserRole.NUTRITIONIST)) {
            return "/nutritionist/dashboard";
        }
        else if (roles.includes(UserRole.CLIENT)) {
            return "/client";
        }
        else if (roles.includes(UserRole.TRAINER)) {
            return "/trainer/dashboard";
        }
        else if (roles.includes(UserRole.ADMIN)) {
            return "/admin";
        }
        return "/";
    },
    // Método para obtener datos específicos según el rol
    async fetchUserRoleData(userData, token) {
        const headers = {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
        try {
            if (userData.roles.includes(UserRole.TRAINER)) {
                const trainerResponse = await axios.get(`http://localhost:8080/api/v1/trainers/${userData.dni}`, { headers });
                userData.trainerData = trainerResponse.data;
                console.log("✅ Datos del entrenador guardados:", userData.trainerData);
            }
            if (userData.roles.includes(UserRole.NUTRITIONIST)) {
                const nutritionistResponse = await axios.get(`http://localhost:8080/api/v1/nutritionists/${userData.dni}`, { headers });
                userData.nutritionistData = nutritionistResponse.data;
                console.log("✅ Datos del nutricionista guardados:", userData.nutritionistData);
            }
            if (userData.roles.includes(UserRole.CLIENT)) {
                const clientResponse = await axios.get(`http://localhost:8080/api/v1/clients/${userData.dni}`, { headers });
                userData.clientData = clientResponse.data;
                console.log("✅ Datos del cliente guardados:", userData.clientData);
            }
            // Admin no necesita datos adicionales según tu requerimiento
        }
        catch (error) {
            console.error("Error fetching user role data:", error);
            const roleName = this.getRoleName(userData.roles[0]);
            throw new Error(`No se pudo obtener la información del ${roleName}`);
        }
    },
    // Método auxiliar para obtener el nombre del rol en español
    getRoleName(role) {
        switch (role) {
            case UserRole.TRAINER:
                return "entrenador";
            case UserRole.NUTRITIONIST:
                return "nutricionista";
            case UserRole.CLIENT:
                return "cliente";
            case UserRole.ADMIN:
                return "administrador";
            default:
                return "usuario";
        }
    },
    // Método para verificar si el usuario tiene un rol específico
    hasRole(role) {
        const currentUser = this.getCurrentUser();
        return currentUser?.roles?.includes(role) || false;
    },
    // Métodos específicos para cada rol
    isTrainer() {
        return this.hasRole(UserRole.TRAINER);
    },
    isNutritionist() {
        return this.hasRole(UserRole.NUTRITIONIST);
    },
    isClient() {
        return this.hasRole(UserRole.CLIENT);
    },
    isAdmin() {
        return this.hasRole(UserRole.ADMIN);
    },
    // Obtener datos específicos según el rol
    getTrainerData() {
        const user = this.getCurrentUser();
        return user?.trainerData || null;
    },
    getNutritionistData() {
        const user = this.getCurrentUser();
        return user?.nutritionistData || null;
    },
    getClientData() {
        const user = this.getCurrentUser();
        return user?.clientData || null;
    },
    // Cambiar contraseña del usuario logueado
    async changePassword(currentPassword, newPassword) {
        const headers = { ...this.getAuthHeader(), 'Content-Type': 'application/json' };
        await axios.put(`${API_URL}/change-password`, { currentPassword, newPassword }, { headers });
    },
    // Resetear contraseña de otro usuario (solo ADMIN)
    async resetPassword(username, newPassword) {
        const headers = { ...this.getAuthHeader(), 'Content-Type': 'application/json' };
        await axios.put(`${API_URL}/admin/reset-password`, { username, newPassword }, { headers });
    },
};
export default authService;
