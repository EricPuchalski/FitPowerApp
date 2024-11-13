
import { User } from "lucide-react";


interface PhysicalStatusProps {
  clientStats: ClientStats[];
}

const PhysicalStatus: React.FC<PhysicalStatusProps> = ({ clientStats }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4 flex items-center">
        <User className="w-6 h-6 mr-2 text-blue-600" />
        Tu estado físico
      </h2>
      <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
        {/* Datos Iniciales */}
        <div className="border-r border-gray-300 pr-4">
          <h3 className="font-bold text-xl mb-4 text-blue-600">Datos Iniciales</h3>
          <p className="mb-2">
            <strong className="text-gray-700">Peso inicial:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[0]?.weight !== undefined
                ? `${clientStats[0]?.weight} kg`
                : "No hay datos"}
            </span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Altura inicial:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[0]?.height !== undefined
                ? `${clientStats[0]?.height} cm`
                : "No hay datos"}
            </span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Grasa corporal inicial:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[0]?.bodyfat !== undefined
                ? `${clientStats[0]?.bodyfat}%`
                : "No hay datos"}
            </span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Masa muscular inicial:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[0]?.bodymass !== undefined
                ? `${clientStats[0]?.bodymass} kg`
                : "No hay datos"}
            </span>
          </p>
        </div>
        {/* Datos Actuales */}
        <div className="pl-4">
          <h3 className="font-bold text-xl mb-4 text-green-600">Datos Actuales</h3>
          <p className="mb-2">
            <strong className="text-gray-700">Peso actual:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[clientStats.length - 1]?.weight !== undefined
                ? `${clientStats[clientStats.length - 1]?.weight} kg`
                : "No hay datos"}
            </span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Altura:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[clientStats.length - 1]?.height !== undefined
                ? `${clientStats[clientStats.length - 1]?.height} cm`
                : "No hay datos"}
            </span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Grasa corporal:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[clientStats.length - 1]?.bodyfat !== undefined
                ? `${clientStats[clientStats.length - 1]?.bodyfat}%`
                : "No hay datos"}
            </span>
          </p>
          <p className="mb-2">
            <strong className="text-gray-700">Masa muscular:</strong>{" "}
            <span className="text-gray-900">
              {clientStats[clientStats.length - 1]?.bodymass !== undefined
                ? `${clientStats[clientStats.length - 1]?.bodymass} kg`
                : "No hay datos"}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default PhysicalStatus;
