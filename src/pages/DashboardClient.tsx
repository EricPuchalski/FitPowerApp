import React, { useEffect, useState } from 'react';
import { Client } from '../model/Client';
import { useNavigate } from 'react-router-dom';

const ClientDashboard: React.FC = () => {
  const [client, setClient] = useState<Client | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientDni = localStorage.getItem('userDni');
        if (!clientDni) {
          throw new Error('No se encontró el DNI del cliente en el almacenamiento local');
        }

const token = localStorage.getItem('token');
const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}`, {
  headers: {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  },
});

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: Client = await response.json();
        setClient(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchClientData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Cargando tu información...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Intentar nuevamente
        </button>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No se encontraron datos del cliente</h2>
        <p className="text-gray-600">Por favor, contacta al soporte técnico.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <div className="flex items-center space-x-3">
            <span className="font-medium">{client.name} {client.lastname}</span>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
              {client?.name?.charAt(0)}{client.lastname?.charAt(0)}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center border-b-4 border-red-500">
            <button className="w-full py-4 font-medium text-red-500"
                          onClick={() => navigate('client')}
>Inicio</button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button 
              onClick={() => navigate('training-plan')}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Entrenamiento
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button 
              onClick={() => navigate('/nutrition-plan')}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Nutrición
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button className="w-full py-4 font-medium text-gray-600 hover:text-gray-900">Progreso</button>
          </li>
        </ul>
      </nav>

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <section className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Bienvenido, {client.name}</h2>
          <p className="text-xl text-gray-600 mb-2">
            Tu objetivo: <strong className="text-indigo-600">{client.goal}</strong>
          </p>
          <p className="text-gray-500">Estamos aquí para ayudarte a alcanzar tus metas de fitness.</p>
        </section>

        {/* Cards Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Personal Info Card */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-500 mb-1">Nombre completo</label>
                <p className="font-medium">{client.name} {client.lastname}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">DNI</label>
                <p className="font-medium">{client.dni}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Teléfono</label>
                <p className="font-medium">{client.phoneNumber}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Email</label>
                <p className="font-medium">{client.email}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Dirección</label>
                <p className="font-medium">{client.address}</p>
              </div>
              <div>
                <label className="block text-sm text-gray-500 mb-1">Gimnasio</label>
                <p className="font-medium">{client.gymName}</p>
              </div>
            </div>
          </section>

          {/* Quick Actions Card */}
          <section className="bg-white rounded-lg shadow-sm p-6">
            <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
              Acciones Rápidas
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <button 
                onClick={() => navigate('/training-plan')}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">🏋️</div>
                <span className="text-sm font-medium text-center">Ver plan de entrenamiento</span>
              </button>
              <button 
                onClick={() => navigate('/nutrition-plan')}
                className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
              >
                <div className="text-3xl mb-2">🍎</div>
                <span className="text-sm font-medium text-center">Ver plan de nutrición</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
           onClick={() => navigate('training-plan/records')}
>
                <div className="text-3xl mb-2">📝</div>
                <span className="text-sm font-medium text-center">Registrar entrenamiento</span>
              </button>
              <button className="flex flex-col items-center justify-center p-4 bg-white border border-gray-200 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all">
                <div className="text-3xl mb-2">🍽️</div>
                <span className="text-sm font-medium text-center">Registrar comida</span>
              </button>
            </div>
          </section>
        </div>

        {/* Progress Section */}
        <section className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4 pb-2 border-b border-gray-100">
            Tu Progreso
          </h3>
          <div className="py-8 text-center bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              Aquí se mostrarán tus métricas de progreso una vez que empieces a registrar actividades.
            </p>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-white py-4 shadow-inner">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} FITPOWER - Todos los derechos reservados</p>
        </div>
      </footer>
    </div>
  );
};

export default ClientDashboard;