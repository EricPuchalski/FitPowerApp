

const baseUrl = "http://localhost:8080/api/routines/client/email/";
const clientUrl = "http://localhost:8080/api/clients/email/";




// Función para obtener los datos del cliente
export async function getClientData(email: string, token: string) {
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


