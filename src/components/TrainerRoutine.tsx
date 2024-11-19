import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card";
import { Input } from "../../components/ui/input";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { ScrollArea } from "../../components/ui/scroll-area";
import { Save, Dumbbell, Trash, Check } from "lucide-react";
import NavBarTrainer from "./NavBarTrainer";
import { FooterPag } from "./Footer";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Routine } from "../model/Routine";
import { Session } from "../model/Session";
import { Client } from "../model/Client";

type Exercise = {
  name: string;
};

const initialRoutine: Routine = {
  id: 0,
  name: "",
  clientDni: "",
  sessions: [],
};

export default function TrainerRoutine() {
  const [routine, setRoutine] = useState<Routine>(initialRoutine);
  const [newSession, setNewSession] = useState<Session>({
    sets: 1,
    reps: 1,
    restTime: "00:01:00",
    exerciseName: "",
  });
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [routineCreated, setRoutineCreated] = useState(false);
  const [openSessionIndex, setOpenSessionIndex] = useState<number | null>(null);
  const [showCreateButton, setShowCreateButton] = useState(true); // Estado para controlar la visibilidad del botón

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");
  const navigate = useNavigate();
  const { clientDni, trainingPlanId } = useParams<{ clientDni: string; trainingPlanId: string }>();

  useEffect(() => {
    if (!token) {
      console.error("Token no disponible");
      return;
    }

    // Fetch clients from API
    fetch(`http://localhost:8080/api/trainers/clients-by-email/${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => setClients(data))
      .catch((error) => console.error("Error fetching clients:", error));

    // Fetch exercises from API
    fetch("http://localhost:8080/api/exercises", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API returns an array of exercise names
        setExerciseOptions(data.map((exercise: Exercise) => exercise.name));
      })
      .catch((error) => console.error("Error fetching exercises:", error));
  }, [token]);

  useEffect(() => {
    if (clientDni) {
      const client = clients.find((c) => c.dni === clientDni);
      setSelectedClient(client || null);
      setRoutine((prevRoutine) => ({
        ...prevRoutine,
        clientDni: clientDni,
      }));
    }
  }, [clientDni, clients]);

  const handleSessionChange = (
    index: number,
    field: keyof Session,
    value: string | number
  ) => {
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      sessions: prevRoutine.sessions.map((session, i) =>
        i === index ? { ...session, [field]: value } : session
      ),
    }));
  };

  const handleAddSession = () => {
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      sessions: [...prevRoutine.sessions, newSession],
    }));
    setNewSession({
      sets: 1,
      reps: 1,
      restTime: "00:01:00",
      exerciseName: "",
    });
    setOpenSessionIndex(routine.sessions.length); // Set the new session index to be open
  };

  const handleDeleteSession = (index: number) => {
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      sessions: prevRoutine.sessions.filter((_, i) => i !== index),
    }));
    if (openSessionIndex === index) {
      setOpenSessionIndex(null); // Close the accordion if the open session is deleted
    }
    toast.error("Sesión eliminada", {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
    });
  };

  const handleConfirmSession = async (index: number) => {
    try {
      const session = routine.sessions[index];
      await fetch(`http://localhost:8080/api/routines/${routine.id}/sessions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(session),
      });
      toast.success("Sesión guardada", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
      console.log("Sesión confirmada:", session);
    } catch (error) {
      console.error("Error al confirmar la sesión:", error);
      toast.error("Error al guardar la sesión", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const handleCreateRoutine = async () => {
    try {
      // Create routine
      const routineResponse = await fetch(
        "http://localhost:8080/api/routines",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            name: routine.name,
            clientDni: routine.clientDni,
          }),
        }
      );

      if (!routineResponse.ok) {
        throw new Error(
          `Error al crear la rutina: ${routineResponse.statusText}`
        );
      }

      const routineData = await routineResponse.json();
      const routineId = routineData.id;

      setRoutine((prevRoutine) => ({
        ...prevRoutine,
        id: routineId,
      }));

      setRoutineCreated(true);
      setShowCreateButton(false); // Ocultar el botón después de crear la rutina
    } catch (error) {
      console.error("Error al crear la rutina:", error);
    }
  };

  const handleSaveRoutine = async () => {
    try {
      // Save sessions to the created routine
      // for (const session of routine.sessions) {
      //   await fetch(`http://localhost:8080/api/routines/${routine.id}/sessions`, {
      //     method: "POST",
      //     headers: {
      //       "Content-Type": "application/json",
      //       Authorization: `Bearer ${token}`,
      //     },
      //     body: JSON.stringify(session),
      //   });
      // }

      // Add routine to the training plan
      await fetch(`http://localhost:8080/api/training-plans/${trainingPlanId}/routines/${routine.id}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Rutina guardada:", routine);
      console.log(trainingPlanId);

      navigate("/trainer/clients");
    } catch (error) {
      console.error("Error al guardar la rutina:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBarTrainer />
      <h1 className="text-3xl font-bold my-6 text-center text-gray-800">
        Crear Rutina a clientes
      </h1>
      <div className="grid grid-cols-2 gap-4 flex-grow">
        <Card className="mb-6 bg-white">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Detalles de la Rutina
            </CardTitle>
            <CardDescription>
              Ingresa los detalles de la rutina
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <Label htmlFor="routineName">Nombre de la Rutina</Label>
              <Input
                id="routineName"
                type="text"
                value={routine.name}
                onChange={(e) =>
                  setRoutine((prevRoutine) => ({
                    ...prevRoutine,
                    name: e.target.value,
                  }))
                }
              />
            </div>
            <div className="mb-4">
              <Label htmlFor="clientDni">Cliente</Label>
              <Select
                value={routine.clientDni}
                onValueChange={(value) => {
                  const selectedClient = clients.find(
                    (client) => client.dni === value
                  );
                  setSelectedClient(selectedClient || null);
                  setRoutine((prevRoutine) => ({
                    ...prevRoutine,
                    clientDni: value,
                  }));
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="Selecciona un cliente" />
                </SelectTrigger>
                <SelectContent className="bg-white">
                  {clients.map((client) => (
                    <SelectItem key={client.dni} value={client.dni}>
                      {client.name} {client.lastname}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedClient && (
              <div className="mb-4 p-4 bg-blue-100 border-l-4 border-blue-500 text-blue-700">
                <p className="font-bold text-lg">
                  El cliente tiene como objetivo {selectedClient.goal}
                </p>
              </div>
            )}
            {showCreateButton && (
              <Button
                onClick={handleCreateRoutine}
                className="w-full h-10 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white font-semibold flex items-center justify-center"
              >
                <Save className="w-4 h-4 mr-2" /> Crear Rutina
              </Button>
            )}
          </CardContent>
        </Card>
        {routineCreated && (
          <Card className="mb-6 bg-white">
            <CardHeader>
              <CardTitle className="text-2xl font-semibold">
                Sesiones de Entrenamiento
              </CardTitle>
              <CardDescription>
                Visualiza y edita los detalles de cada sesión de tu entrenamiento
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[400px] w-full rounded-md border p-4">
                <Accordion type="single" collapsible className="w-full" value={`session-${openSessionIndex}`}>
                  {routine.sessions.map((session, index) => (
                    <AccordionItem key={index} value={`session-${index}`}>
                      <AccordionTrigger className="text-lg font-medium">
                        {index + 1}. {session.exerciseName}
                      </AccordionTrigger>
                      <AccordionContent>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`sets-${index}`}>Series</Label>
                            <Input
                              id={`sets-${index}`}
                              type="number"
                              value={session.sets}
                              onChange={(e) =>
                                handleSessionChange(
                                  index,
                                  "sets",
                                  parseInt(e.target.value)
                                )
                              }
                              min={1}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`reps-${index}`}>
                              Repeticiones
                            </Label>
                            <Input
                              id={`reps-${index}`}
                              type="number"
                              value={session.reps}
                              onChange={(e) =>
                                handleSessionChange(
                                  index,
                                  "reps",
                                  parseInt(e.target.value)
                                )
                              }
                              min={1}
                            />
                          </div>
                          <div>
                            <Label htmlFor={`rest-${index}`}>
                              Tiempo de Descanso
                            </Label>
                            <Input
                              id={`rest-${index}`}
                              type="time"
                              value={session.restTime}
                              onChange={(e) =>
                                handleSessionChange(
                                  index,
                                  "restTime",
                                  e.target.value
                                )
                              }
                              step="1"
                            />
                          </div>
                          <div>
                            <Label htmlFor={`exercise-${index}`}>
                              Ejercicio
                            </Label>
                            <Select
                              value={session.exerciseName}
                              onValueChange={(value) =>
                                handleSessionChange(
                                  index,
                                  "exerciseName",
                                  value
                                )
                              }
                            >
                              <SelectTrigger className="bg-white">
                                <SelectValue placeholder="Selecciona un ejercicio" />
                              </SelectTrigger>
                              <SelectContent className="bg-white">
                                {exerciseOptions.map((exercise) => (
                                  <SelectItem key={exercise} value={exercise}>
                                    {exercise}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          <div className="flex justify-end space-x-2">
                            <Button
                              onClick={() => handleDeleteSession(index)}
                              className="bg-red-500 hover:bg-red-600 text-white transition-colors"
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                            <Button
                              onClick={() => handleConfirmSession(index)}
                              className="bg-green-500 hover:bg-green-600 text-white transition-colors"
                            >
                              <Check className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </ScrollArea>
            </CardContent>
          </Card>
        )}
      </div>
      {routineCreated && (
        <div className="flex items-center justify-center p-4">
          <div className="w-1/2 mr-4">
            <Button
              onClick={handleAddSession}
              className="w-full h-20 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white font-semibold flex items-center justify-center"
            >
              <Dumbbell className="w-4 h-4 mr-2" /> Añadir Sesión
            </Button>
          </div>
          <div className="w-1/2 ml-4">
            <Button
              onClick={handleSaveRoutine}
              className="w-full h-20 bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-white font-semibold flex items-center justify-center"
            >
              <Save className="w-4 h-4 mr-2" /> Guardar Rutina
            </Button>
          </div>
        </div>
      )}
      <FooterPag className="mt-auto" />
      <ToastContainer />
    </div>
  );
}
