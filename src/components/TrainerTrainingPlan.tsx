import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Button } from "../../components/ui/button";
import { useParams, Link } from "react-router-dom";
import NavBarTrainer from "./NavBarTrainer";
import { FooterPag } from "./Footer";
import { Pencil, Trash } from "lucide-react"; // Asegúrate de instalar lucide-react
import Swal from 'sweetalert2'; // Asegúrate de instalar sweetalert2

// Definición de tipos
type Session = {
  exerciseName: string;
  sets: number;
  reps: number;
  restTime: number;
};

type Routine = {
  id: number;
  name: string;
  creationDate: string;
  sessions: Session[];
};

// Componente principal
export default function TrainerTrainingPlan() {
  const [routines, setRoutines] = useState<Routine[]>([]);
  const { clientDni } = useParams<{ clientDni: string }>();

  useEffect(() => {
    if (!clientDni) {
      console.error("DNI del cliente no disponible");
      return;
    }

    // Fetch routines from API
    fetch(`http://localhost:8080/api/routines/client/${clientDni}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setRoutines(data))
      .catch((error) => console.error("Error fetching routines:", error));
  }, [clientDni]);

  const handleDeleteRoutine = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/routines/${id}`, {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              setRoutines(routines.filter(routine => routine.id !== id));
              Swal.fire('Eliminado', 'La rutina ha sido eliminada.', 'success');
            } else {
              throw new Error('Error al eliminar la rutina');
            }
          })
          .catch((error) => {
            console.error("Error deleting routine:", error);
            Swal.fire('Error', 'Hubo un problema al eliminar la rutina.', 'error');
          });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBarTrainer />
      <div className="flex-grow p-4">
        <h1 className="text-2xl font-bold mb-6 text-gray-800">
          Plan de entrenamiento actual del cliente:
        </h1>
        {routines.map((routine) => (
          <div
            key={routine.id}
            className="mb-8 bg-white shadow-md rounded-lg overflow-hidden w-3/4 mx-auto"
          >
            <div className="p-4 bg-blue-100 border-b flex justify-between items-center rounded-lg shadow-md">
              <div className="flex items-center space-x-4 p-4 bg-blue-500 text-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold">{routine.name}</h2>
                <p className="text-gray-200">
                  Creación: {new Date(routine.creationDate).toLocaleDateString()}
                </p>
              </div>

              <div className="flex space-x-2">
                <Button
                  asChild
                  variant="outline"
                  className="flex items-center space-x-2 bg-green-500 text-white hover:bg-green-600"
                >
                  <div className="flex items-center space-x-2">
                    <Pencil className="h-5 w-5" />
                    <Link to={`/modificar-rutina/${routine.id}`}>Modificar</Link>
                  </div>
                </Button>
                <Button
                  asChild
                  variant="destructive"
                  className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600"
                  onClick={() => handleDeleteRoutine(routine.id)}
                >
                  <div className="flex items-center space-x-2">
                    <Trash className="h-5 w-5" />
                    <span>Eliminar</span>
                  </div>
                </Button>
              </div>
            </div>

            <Table className="w-full bg-white">
              <TableHeader className="bg-gray-200 text-gray-900">
                <TableRow>
                  <TableHead className="py-2 px-4 bg-blue-300 text-white">Ejercicio</TableHead>
                  <TableHead className="py-2 px-4 bg-blue-300 text-white">Series</TableHead>
                  <TableHead className="py-2 px-4 bg-blue-300 text-white">Repeticiones</TableHead>
                  <TableHead className="py-2 px-4 bg-blue-300 text-white">Descanso</TableHead>

                </TableRow>
              </TableHeader>
              <TableBody>
                {routine.sessions.map((session, index) => (
                  <TableRow key={index} className="border-b">
                    <TableCell className="py-2 px-4 bg-blue-100">{session.exerciseName}</TableCell>
                    <TableCell className="py-2 px-4 bg-blue-100">{session.sets}</TableCell>
                    <TableCell className="py-2 px-4 bg-blue-100">{session.reps}</TableCell>
                    <TableCell className="py-2 px-4 bg-blue-100">{session.restTime}</TableCell>

                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ))}
      </div>
      <FooterPag />
    </div>
  );
}
