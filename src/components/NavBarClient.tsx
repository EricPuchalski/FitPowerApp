import { Apple, Bell, Dumbbell, User } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

export type Notification = {
  id: string;
  message: string;
  seen: boolean;
  creationDate: Date;
};

export type Client = {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  email: string;
  goal: string;
  gymName: string;
  trainerDni: string;
  nutritionistDni: string;
  initialPhysicalState: string;
};

const clientUrl = "http://localhost:8080/api/clients/email/";

const token = localStorage.getItem("token");
const email = localStorage.getItem("userEmail");

// Función para obtener los datos del cliente
async function getClientData(): Promise<Client> {
  try {
    const response = await fetch(`${clientUrl}${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del cliente:", error);
    throw error;
  }
}

export const NavBarClient = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData = await getClientData();
        setClient(clientData);
      } catch (error) {
        console.error('Error fetching client data:', error);
      }
    };

    fetchClientData();
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      if (client) {
        try {
          const response = await axios.get<Notification[]>(`http://localhost:8080/api/clients/${client.dni}/notifications`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          setNotifications(response.data);
        } catch (error) {
          console.error('Error fetching notifications:', error);
        }
      }
    };

    fetchNotifications();
  }, [client]);

  const markAsRead = async (notificationId: string) => {
    if (client) {
      try {
        await axios.put(`http://localhost:8080/api/clients/${client.dni}/notifications/${notificationId}/mark`, {}, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setNotifications(notifications.filter(notification => notification.id !== notificationId));
      } catch (error) {
        console.error('Error marking notification as read:', error);
      }
    }
  };

  const unreadCount = notifications.filter(notification => !notification.seen).length;

  return (
    <header className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Dumbbell className="w-8 h-8" />
          <h1 className="text-2xl font-bold">FitPower Cliente</h1>
        </div>
        <nav className="hidden md:flex space-x-6">
          <a
            href="/client"
            className="hover:text-blue-200 transition flex items-center space-x-1"
          >
            <User size={18} />
            <span>Perfil</span>
          </a>
          <a
            href="/client/training"
            className="hover:text-blue-200 transition flex items-center space-x-1"
          >
            <Dumbbell size={18} />
            <span>Entrenamiento</span>
          </a>
          <a
            href="/client/nutrition"
            className="hover:text-blue-200 transition flex items-center space-x-1"
          >
            <Apple size={18} />
            <span>Nutrición</span>
          </a>
          <div className="relative">
            <a
              href="#"
              className="hover:text-blue-200 transition flex items-center space-x-1"
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <Bell size={18} />
              {unreadCount > 0 && (
                <span className="bg-red-500 text-white rounded-full px-2 py-1 text-xs absolute -top-2 -right-2">
                  {unreadCount}
                </span>
              )}
            </a>
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold mb-2">Notificaciones</h2>
                {notifications.length > 0 ? (
                  notifications.map(notification => (
                    <div key={notification.id} className="p-2 border-b border-gray-200">
                      <p className="text-gray-800">{notification.message}</p>
                      <button
                        className="text-blue-500 hover:underline mt-2"
                        onClick={() => markAsRead(notification.id)}
                      >
                        Marcar como leído
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No hay notificaciones.</p>
                )}
              </div>
            )}
          </div>
        </nav>
        <button
          className="md:hidden bg-blue-800 p-2 rounded-md hover:bg-indigo-700 transition"
        >
        </button>
      </div>
    </header>
  );
};
