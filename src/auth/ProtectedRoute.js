import { jsx as _jsx, Fragment as _Fragment } from "react/jsx-runtime";
import { Navigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';
export const ProtectedRoute = ({ children, allowedRoles = [], fallbackPath = '/' }) => {
    const { isAuthenticated, user, loading } = useAuth();
    // Mostrar loading mientras verifica la autenticación
    if (loading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center bg-[#220901]", children: _jsx("div", { className: "text-[#F6AA1C] text-xl", children: "Cargando..." }) }));
    }
    // Redirigir al login si no está autenticado
    if (!isAuthenticated || !user) {
        return _jsx(Navigate, { to: "/", replace: true });
    }
    // Verificar roles si se especificaron
    if (allowedRoles.length > 0) {
        const hasAllowedRole = allowedRoles.some(role => user.roles.includes(role));
        if (!hasAllowedRole) {
            // Redirigir al dashboard correspondiente según el rol del usuario
            if (user.roles.includes('ROLE_ADMIN')) {
                return _jsx(Navigate, { to: "/admin", replace: true });
            }
            else if (user.roles.includes('ROLE_TRAINER')) {
                return _jsx(Navigate, { to: "/trainer/dashboard", replace: true });
            }
            else if (user.roles.includes('ROLE_NUTRITIONIST')) {
                return _jsx(Navigate, { to: "/nutritionist/dashboard", replace: true });
            }
            else if (user.roles.includes('ROLE_CLIENT')) {
                return _jsx(Navigate, { to: "/client", replace: true });
            }
            return _jsx(Navigate, { to: "/", replace: true });
        }
    }
    return _jsx(_Fragment, { children: children });
};
// Componentes específicos para cada rol
export const TrainerRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_TRAINER'], children: children }));
export const NutritionistRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_NUTRITIONIST'], children: children }));
export const ClientRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_CLIENT'], children: children }));
export const AdminRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_ADMIN'], children: children }));
// Rutas que pueden ser accedidas por múltiples roles
export const TrainerAdminRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_TRAINER', 'ROLE_ADMIN'], children: children }));
export const NutritionistAdminRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_NUTRITIONIST', 'ROLE_ADMIN'], children: children }));
export const AllRolesRoute = ({ children }) => (_jsx(ProtectedRoute, { allowedRoles: ['ROLE_ADMIN', 'ROLE_TRAINER', 'ROLE_NUTRITIONIST', 'ROLE_CLIENT'], children: children }));
