import { Client } from "../model/Client";


interface ClientInfoProps {
  client: Client;
}

const ClientInfo: React.FC<ClientInfoProps> = ({ client }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8">
      <h2 className="text-2xl font-semibold mb-4">Información personal</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <p>
            <strong>Nombre:</strong> {client.name || "No tiene"}
          </p>
          <p>
            <strong>Apellido:</strong> {client.lastname || "No tiene"}
          </p>
          
        </div>
        <div>
          <p>
            <strong>Gimnasio:</strong> {client.gymName || "No tiene"}
          </p>
          <p>
            <strong>Nutricionista:</strong> {client.nutritionistDni || "No tiene"}
          </p>
        </div>
        <div>
          <p>
            <strong>Entrenador:</strong> {client.trainerDni || "No tiene"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ClientInfo;
