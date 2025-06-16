// src/App.js
import React, { useEffect, useState } from 'react';
import { getClientStatuses } from '../services/ClientStatusApi';
import WeightChart from './ClientPhysicalStatusChart';

const ClientsCharts = () => {
  const [clientStatuses, setClientStatuses] = useState([]);
  const clientId = '32423432'; // Reemplaza con el ID del cliente que deseas consultar

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getClientStatuses(clientId);
        setClientStatuses(data);
      } catch (error) {
        console.error('Error fetching client statuses:', error);
      }
    };

    fetchData();
  }, [clientId]);

  return (
    <div>
      <h1>Estados del Físico del Cliente</h1>
      {clientStatuses.length > 0 ? (
        <WeightChart data={clientStatuses} />
      ) : (
        <p>Cargando datos...</p>
      )}
    </div>
  );
};

export default ClientsCharts;
