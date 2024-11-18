import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface AddPhysicalStatusProps {
  clientDni: string;
  onUpdate: () => void;
}

const AddPhysicalStatus: React.FC<AddPhysicalStatusProps> = ({ clientDni, onUpdate }) => {
  const [weight, setWeight] = useState<number | null>(null);
  const [height, setHeight] = useState<number | null>(null);
  const [bodymass, setBodymass] = useState<number | null>(null);
  const [bodyfat, setBodyfat] = useState<number | null>(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async () => {
    const url = `http://localhost:8080/api/clients/${clientDni}/statuses`;

    const data = {
      weight,
      height,
      bodymass,
      bodyfat,
    };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const result = await response.json();
      console.log('Registro guardado:', result);

      // Mostrar notificación de éxito
      toast.success('Registro creado exitosamente', {
        style: {
          backgroundColor: '#cbffa5',
          color: '#6aa3fc',
        },
      });

      // Cerrar el diálogo
      setOpen(false);

      // Limpiar los campos del formulario
      setWeight(null);
      setHeight(null);
      setBodymass(null);
      setBodyfat(null);

      // Actualizar la lista de estados físicos
      onUpdate();
    } catch (error) {
      console.error('Error al guardar el registro:', error);
      toast.error('Error al guardar el registro');
    }
  };

  return (
    <div className="flex justify-end space-x-4 mb-4">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            className="bg-green-500 hover:bg-green-600 text-white font-semibold my-3 py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out border-none shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-green-300"
          >
            Añadir nuevo registro
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-md bg-white p-4">
          <DialogTitle className="text-lg font-medium text-gray-900">
            Nuevo registro de composición corporal
          </DialogTitle>
          <div className="mt-4">
            <div>
              <label htmlFor="peso" className="block text-sm font-medium text-gray-700">
                Peso (kg)
              </label>
              <input
                type="number"
                name="peso"
                id="peso"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu peso"
                onChange={(e) => setWeight(parseFloat(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="altura" className="block text-sm font-medium text-gray-700">
                Altura (cm)
              </label>
              <input
                type="number"
                name="altura"
                id="altura"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu altura"
                onChange={(e) => setHeight(parseFloat(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="masaMuscular" className="block text-sm font-medium text-gray-700">
                Masa muscular (kg)
              </label>
              <input
                type="number"
                name="masaMuscular"
                id="masaMuscular"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu masa muscular"
                onChange={(e) => setBodymass(parseFloat(e.target.value))}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="grasaCorporal" className="block text-sm font-medium text-gray-700">
                Grasa corporal (%)
              </label>
              <input
                type="number"
                name="grasaCorporal"
                id="grasaCorporal"
                className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                placeholder="Ingresa tu porcentaje de grasa corporal"
                onChange={(e) => setBodyfat(parseFloat(e.target.value))}
              />
            </div>
            <div className="flex justify-end mt-4">
              <button
                type="button"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                onClick={handleSubmit}
              >
                Guardar
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      <ToastContainer />
    </div>
  );
};

export default AddPhysicalStatus;
