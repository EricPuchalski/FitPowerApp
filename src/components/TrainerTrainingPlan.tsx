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
import CreateNewTrainingPlan from "./CreateTrainingPlan";
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
  active: boolean; // Añadido el campo active
};

type TrainingPlan = {
  id: number;
  clientDni: string;
  active: boolean;
  name: string;
  description: string;
  routines: Routine[];
};

// Componente principal
export default function TrainerTrainingPlan() {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const { clientDni } = useParams<{ clientDni: string }>();

  useEffect(() => {
    if (!clientDni) {
      console.error("DNI del cliente no disponible");
      return;
    }

    // Fetch training plan from API
    fetch(`http://localhost:8080/api/training-plans/active/${clientDni}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Data received:", data); // Añade esto para verificar los datos recibidos
        setTrainingPlan(data);
      })
      .catch((error) => console.error("Error fetching training plan:", error));
  }, [clientDni]);

  const handleDeactivateRoutine = (id: number) => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "¡No podrás revertir esto!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, desactivar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        fetch(`http://localhost:8080/api/routines/deactivate/${id}`, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        })
          .then((response) => {
            if (response.ok) {
              setTrainingPlan((prevPlan) => {
                if (prevPlan) {
                  return {
                    ...prevPlan,
                    routines: prevPlan.routines.map(routine =>
                      routine.id === id ? { ...routine, active: false } : routine
                    ),
                  };
                }
                return prevPlan;
              });
              Swal.fire('Desactivado', 'La rutina ha sido desactivada.', 'success');
            } else {
              throw new Error('Error al desactivar la rutina');
            }
          })
          .catch((error) => {
            console.error("Error deactivating routine:", error);
            Swal.fire('Error', 'Hubo un problema al desactivar la rutina.', 'error');
          });
      }
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <NavBarTrainer />
      <div className="flex-grow p-4">
        <div className="flex justify-center space-x-4 my-8">
          <Button
            asChild
            variant="outline"
            className="flex items-center space-x-2 bg-blue-500 text-white hover:bg-blue-600"
          >
            <Link to={`/trainer/client/${clientDni}/training-plans/${trainingPlan?.id}/routine`}>
              <div className="flex items-center space-x-2">
                <span>Agregar Rutina</span>
              </div>
            </Link>
          </Button>
          <CreateNewTrainingPlan clientDni={clientDni} /> {/* Usa el nuevo componente aquí */}
          <Button
            asChild
            variant="outline"
            className="flex items-center space-x-2 bg-purple-500 text-white hover:bg-purple-600"
          >
            <Link to={`/ver-historial-planes/${clientDni}`}>
              <div className="flex items-center space-x-2">
                <span>Ver Historial de Planes</span>
              </div>
            </Link>
          </Button>
        </div>
        {trainingPlan && (
          <div className="mb-8 bg-white shadow-md rounded-lg overflow-hidden w-3/4 mx-auto p-4">
            <div className="bg-blue-100 border-b flex flex-col space-y-4 p-4 rounded-lg shadow-md">
              <h2 className="text-xl font-semibold text-blue-700">{trainingPlan.name}</h2>
              <p className="text-gray-700">{trainingPlan.description}</p>
            </div>
          </div>
        )}
        {trainingPlan && trainingPlan.routines.sort((a, b) => (a.active === b.active ? 0 : a.active ? -1 : 1)).map((routine) => (
          <div
            key={routine.id}
            className={`mb-8 bg-white shadow-md rounded-lg overflow-hidden w-3/4 mx-auto ${routine.active ? '' : 'bg-gray-900 opacity-75'}`}
          >
            <div className={`p-4 ${routine.active ? 'bg-blue-100' : 'bg-gray-500'} border-b flex justify-between items-center rounded-lg shadow-md`}>
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
                {routine.active ? (
                  <Button
                    asChild
                    variant="destructive"
                    className="flex items-center space-x-2 bg-red-500 text-white hover:bg-red-600"
                    onClick={() => handleDeactivateRoutine(routine.id)}
                  >
                    <div className="flex items-center space-x-2">
                      <Trash className="h-5 w-5" />
                      <span>Desactivar</span>
                    </div>
                  </Button>
                ) : (
                  <span className="text-red-200 font-semibold">Desactivado</span>
                )}
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
