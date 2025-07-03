// src/components/ProtectedRoute.tsx
import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './hook/useAuth';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  fallbackPath?: string;
}

export const ProtectedRoute = ({ 
  children, 
  allowedRoles = [], 
  fallbackPath = '/' 
}: ProtectedRouteProps) => {
  const { isAuthenticated, user, loading } = useAuth();

  // Mostrar loading mientras verifica la autenticación
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#220901]">
        <div className="text-[#F6AA1C] text-xl">Cargando...</div>
      </div>
    );
  }

  // Redirigir al login si no está autenticado
  if (!isAuthenticated || !user) {
    return <Navigate to="/" replace />;
  }

  // Verificar roles si se especificaron
  if (allowedRoles.length > 0) {
    const hasAllowedRole = allowedRoles.some(role => user.roles.includes(role));
    if (!hasAllowedRole) {
      // Redirigir al dashboard correspondiente según el rol del usuario
      if (user.roles.includes('ROLE_ADMIN')) {
        return <Navigate to="/admin" replace />;
      } else if (user.roles.includes('ROLE_TRAINER')) {
        return <Navigate to="/trainer/dashboard" replace />;
      } else if (user.roles.includes('ROLE_NUTRITIONIST')) {
        return <Navigate to="/nutritionist/dashboard" replace />;
      } else if (user.roles.includes('ROLE_CLIENT')) {
        return <Navigate to="/client" replace />;
      }
      return <Navigate to="/" replace />;
    }
  }

  return <>{children}</>;
};

// Componentes específicos para cada rol
export const TrainerRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_TRAINER']}>
    {children}
  </ProtectedRoute>
);

export const NutritionistRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_NUTRITIONIST']}>
    {children}
  </ProtectedRoute>
);

export const ClientRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_CLIENT']}>
    {children}
  </ProtectedRoute>
);

export const AdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_ADMIN']}>
    {children}
  </ProtectedRoute>
);

// Rutas que pueden ser accedidas por múltiples roles
export const TrainerAdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_TRAINER', 'ROLE_ADMIN']}>
    {children}
  </ProtectedRoute>
);

export const NutritionistAdminRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_NUTRITIONIST', 'ROLE_ADMIN']}>
    {children}
  </ProtectedRoute>
);

export const AllRolesRoute = ({ children }: { children: ReactNode }) => (
  <ProtectedRoute allowedRoles={['ROLE_ADMIN', 'ROLE_TRAINER', 'ROLE_NUTRITIONIST', 'ROLE_CLIENT']}>
    {children}
  </ProtectedRoute>
);