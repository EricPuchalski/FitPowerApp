// src/services/TrainingService.ts

export async function getClientData(email: string, token: string) {
    try {
      // Primero necesitas obtener el cliente por email
      // Como tu API usa DNI, necesitarás adaptar esto según tu backend
      const response = await fetch(`http://localhost:8080/api/v1/clients/email/${email}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
      
      if (!response.ok) {
        throw new Error('Error fetching client data');
      }
      
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching client data:', error);
      throw error;
    }
  }