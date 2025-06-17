import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Card, Button } from '@/components/ui';
import { useToast } from '@/hooks/use-toast';

const DashboardTrainer: React.FC = () => {
  const { gymName } = useParams<{ gymName: string }>();
  const [trainerName, setTrainerName] = useState<string>('');
  const [clients, setClients] = useState([]);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainerName = async () => {
      try {
        const token = localStorage.getItem('token');
        const userDni = localStorage.getItem('userDni');
        const response = await axios.get(`/api/v1/trainers/${userDni}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTrainerName(response.data.name);
      } catch (error) {
        toast({
          title: 'Error al cargar el nombre del entrenador',
          description: 'Hubo un problema al obtener el nombre del entrenador.',
          variant: 'destructive',
        });
      }
    };

    const fetchClients = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get(`/api/v1/clients/gym/${gymName}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setClients(response.data);
      } catch (error) {
        toast({
          title: 'Error al cargar los clientes',
          description: 'Hubo un problema al obtener los clientes del gimnasio.',
          variant: 'destructive',
        });
      }
    };

    fetchTrainerName();
    fetchClients();
  }, [gymName, toast]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-black">Bienvenido, {trainerName}</h1>
      <div className="grid grid-cols-1 gap-4 mt-6">
        {clients.map((client: any) => (
          <Card key={client.id} className="p-4 shadow-md rounded-lg bg-light-blue">
            <h2 className="text-xl font-semibold text-black">{client.name}</h2>
            <div className="mt-4 flex space-x-4">
              <Button
                onClick={() => navigate(`/trainer/client/${client.id}/training-plans`)}
                className="bg-light-pink text-white hover:bg-pink-600"
              >
                Ver Planes
              </Button>
              <Button
                onClick={() => navigate(`/trainer/client/${client.id}/training-plans/new`)}
                className="bg-light-pink text-white hover:bg-pink-600"
              >
                Crear Plan
              </Button>
              <Button
                onClick={() => navigate(`/trainer/client/${client.id}/progress`)}
                className="bg-light-pink text-white hover:bg-pink-600"
              >
                Ver Progreso
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default DashboardTrainer;