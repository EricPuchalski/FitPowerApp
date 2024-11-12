import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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
import { Save, Clock, Dumbbell, Trash } from "lucide-react";
import { NavBarClient } from "./NavBarClient";
import { FooterPag } from "./Footer";
import { FaDumbbell } from "react-icons/fa";
import Fireworks from "./Fireworks";

type Client = {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  email: string;
  goal: string;
};

type Session = {
  id: number;
  sets: number;
  reps: number;
  weight: number;
  restTime: string;
  exerciseName: string;
};

type Routine = {
  completed: boolean;
  id: number;
  name: string;
  sessions: Session[];
};

const initialRoutine: Routine = {
  id: 1,
  name: "Rutina de Fuerza",
  sessions: [],
  completed: false,
};

export default function ClientRoutine() {
  const [routine, setRoutine] = useState<Routine>(initialRoutine);
  const [newSession, setNewSession] = useState<Omit<Session, "id">>({
    sets: 1,
    reps: 1,
    weight: 0,
    restTime: "00:01:00",
    exerciseName: "",
  });
  const [exerciseOptions, setExerciseOptions] = useState<string[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [trainingDiaryId, setTrainingDiaryId] = useState<number | null>(null);
  const [trainingSessions, setTrainingSessions] = useState<Session[]>([]);
  const [sessionToDelete, setSessionToDelete] = useState<number | null>(null);
  const [showCongratulations, setShowCongratulations] = useState(false);
  const [observaciones, setObservaciones] = useState('');

  const [active, setActive] = useState<boolean>(false);

  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  async function getClientData(email: string, token: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/clients/email/${email}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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

  async function fetchTrainingSessions(trainingDiaryId: number, token: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/training-diaries/${trainingDiaryId}/sessions`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      const data = await response.json();

      setTrainingSessions(data);
    } catch (error) {
      console.error("Error al obtener las sesiones del training diary:", error);
    }
  }

  async function deleteSession(sessionId: number, token: string) {
    try {
      const response = await fetch(
        `http://localhost:8080/api/training-diaries/sessions/${sessionId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }

      console.log("Sesión eliminada:", sessionId);
      // Refresh the training sessions after deleting
      if (trainingDiaryId) {
        fetchTrainingSessions(trainingDiaryId, token);
      }
    } catch (error) {
      console.error("Error al eliminar la sesión:", error);
    }
  }

  useEffect(() => {
    if (!token || !email) {
      console.error("Token o email no disponibles");
      return;
    }

    // Fetch exercises from API
    fetch("http://localhost:8080/api/exercises", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Assuming the API returns an array of exercise names
        setExerciseOptions(
          data.map((exercise: { name: any }) => exercise.name)
        );
      })
      .catch((error) => console.error("Error fetching exercises:", error));

    // Get routine ID from URL params
    const routineId = searchParams.get("routineId");
    if (routineId) {
      // Fetch active routine from API using routine ID
      fetch(`http://localhost:8080/api/routines/${routineId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => response.json())
        .then((data) => setRoutine(data))
        .catch((error) => console.error("Error fetching routine:", error));
    }

    // Fetch client data
    getClientData(email, token)
      .then((data) => setClient(data))
      .catch((error) => console.error("Error fetching client data:", error));

    // Get training diary ID from URL params
    const diaryId = searchParams.get("trainingDiaryId");
    if (diaryId) {
      setTrainingDiaryId(parseInt(diaryId));
      fetchTrainingSessions(parseInt(diaryId), token);
    }
  }, [token, email, searchParams]);

  const handleSessionChange = (
    sessionId: number,
    field: keyof Session,
    value: string | number
  ) => {
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      sessions: prevRoutine.sessions.map((session) =>
        session.id === sessionId ? { ...session, [field]: value } : session
      ),
    }));
  };

  const handleAddSession = () => {
    const newId = Math.max(...routine.sessions.map((s) => s.id), 0) + 1;
    setRoutine((prevRoutine) => ({
      ...prevRoutine,
      sessions: [...prevRoutine.sessions, { id: newId, ...newSession }],
    }));
    setNewSession({
      sets: 1,
      reps: 1,
      weight: 0,
      restTime: "00:01:00",
      exerciseName: exerciseOptions[0],
    });
  };

  const handleSaveRoutine = () => {
    console.log("Rutina guardada:", routine);
    // Aquí iría la lógica para guardar la rutina en el backend
  };

  const handleSaveSession = async (session: Session) => {
    if (!trainingDiaryId) {
      console.error("TrainingDiary ID not available");
      return;
    }

    try {
      // Save session to the created TrainingDiary
      await fetch(
        `http://localhost:8080/api/training-diaries/${trainingDiaryId}/sessions`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            reps: session.reps,
            exerciseName: session.exerciseName,
            weight: session.weight,
          }),
        }
      );

      console.log("Session saved:", session);
      // Refresh the training sessions after saving
      fetchTrainingSessions(trainingDiaryId, token);
    } catch (error) {
      console.error("Error saving session:", error);
    }
  };

  const handleDeleteSession = (sessionId: number) => {
    setSessionToDelete(sessionId);
  };

  const confirmDeleteSession = () => {
    if (sessionToDelete && token) {
      deleteSession(sessionToDelete, token);
      setSessionToDelete(null);
    }
  };

  const cancelDeleteSession = () => {
    setSessionToDelete(null);
  };

  const handleFinalizar = async () => {
    try {
      // Actualizar el diario de entrenamiento con las observaciones
      const updateDiaryResponse = await fetch(
        `http://localhost:8080/api/training-diaries/${trainingDiaryId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ observation: observaciones }),
        }
      );

      if (!updateDiaryResponse.ok) {
        throw new Error(
          `Error al actualizar el diario de entrenamiento: ${updateDiaryResponse.statusText}`
        );
      }

      // Obtener el plan de entrenamiento activo del cliente
      const trainingPlanResponse = await fetch(
        `http://localhost:8080/api/training-plans/active/${client?.dni}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!trainingPlanResponse.ok) {
        throw new Error(
          `Error al obtener el plan de entrenamiento activo: ${trainingPlanResponse.statusText}`
        );
      }

      const trainingPlan = await trainingPlanResponse.json();

      // Obtener las rutinas activas del plan de entrenamiento
      const activeRoutinesResponse = await fetch(
        `http://localhost:8080/api/training-plans/${trainingPlan.id}/active-routines`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!activeRoutinesResponse.ok) {
        throw new Error(
          `Error al obtener las rutinas activas del plan de entrenamiento: ${activeRoutinesResponse.statusText}`
        );
      }

      const activeRoutines = await activeRoutinesResponse.json();

      // Verificar si todas las rutinas están completadas
      const allRoutinesCompleted = activeRoutines
        .filter((r: Routine) => r.id !== routine.id)
        .every((r: Routine) => r.completed);

      if (allRoutinesCompleted) {
        setShowCongratulations(true);
        setActive(true); // Activar los fuegos artificiales
        setTimeout(() => {
          setShowCongratulations(false);
          setActive(false); // Desactivar los fuegos artificiales
          navigate("/client/training");
        }, 5000); // Mostrar el cuadro de felicitación durante 5 segundos
      } else {
        navigate("/client/training");
      }

      // Completar la rutina actual
      const response = await fetch(
        `http://localhost:8080/api/routines/${routine.id}/complete`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error en la solicitud: ${response.statusText}`);
      }
    } catch (error) {
      console.error("Error al completar la rutina:", error);
    }
  };

  return (
    <div className="container mx-auto p-4 bg-gray-100 min-h-screen">
      <NavBarClient />
      <h1 className="text-3xl font-bold my-6 text-center text-gray-800">
        {routine.name}
      </h1>
      <div className="grid grid-cols-2 gap-4">
        <Card className="mb-6">
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
              <Accordion type="single" collapsible className="w-full">
                {routine.sessions.map((session, index) => (
                  <AccordionItem
                    key={session.id}
                    value={`session-${session.id}`}
                  >
                    <AccordionTrigger className="text-lg font-medium">
                      {index + 1}. {session.exerciseName}
                    </AccordionTrigger>
                    <AccordionContent>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`weight-${session.id}`}>
                            Peso (kg)
                          </Label>
                          <Input
                            id={`weight-${session.id}`}
                            type="number"
                            value={session.weight}
                            onChange={(e) =>
                              handleSessionChange(
                                session.id,
                                "weight",
                                parseFloat(e.target.value)
                              )
                            }
                            min={0}
                            step={0.5}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`reps-${session.id}`}>
                            Repeticiones
                          </Label>
                          <Input
                            id={`reps-${session.id}`}
                            type="number"
                            value={session.reps}
                            onChange={(e) =>
                              handleSessionChange(
                                session.id,
                                "reps",
                                parseInt(e.target.value)
                              )
                            }
                            min={1}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`sets-${session.id}`}>Series</Label>
                          <Input
                            id={`sets-${session.id}`}
                            disabled
                            type="number"
                            value={session.sets}
                            onChange={(e) =>
                              handleSessionChange(
                                session.id,
                                "sets",
                                parseInt(e.target.value)
                              )
                            }
                            min={1}
                          />
                        </div>
                        <div>
                          <Label htmlFor={`rest-${session.id}`}>
                            Tiempo de Descanso
                          </Label>
                          <Input
                            id={`rest-${session.id}`}
                            type="time"
                            value={session.restTime}
                            onChange={(e) =>
                              handleSessionChange(
                                session.id,
                                "restTime",
                                e.target.value
                              )
                            }
                            step="1"
                            disabled // Aquí se deshabilita el campo
                          />
                        </div>
                        <Button
                          onClick={() => handleSaveSession(session)}
                          className="mt-4 w-full bg-green-500 hover:bg-green-600 active:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 text-white font-semibold"
                        >
                          <Save className="w-4 h-4 mr-2" /> Guardar Sesión
                        </Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </CardContent>
        </Card>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold">
              Diario de entrenamiento
            </CardTitle>
            <CardDescription>
              Sesiones guardadas de tus ejercicios realizados!
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[400px] w-full rounded-md border p-4">
              <table className="w-full border-collapse bg-white shadow-sm rounded-lg overflow-hidden">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Ejercicio
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Repeticiones
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Peso (kg)
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Eliminar
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {trainingSessions.map((session) => (
                    <tr
                      key={session.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.exerciseName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.reps}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {session.weight}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <Button
                          onClick={() => handleDeleteSession(session.id)}
                          className="bg-red-500 hover:bg-red-600 text-white transition-colors"
                        >
                          <Trash className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </ScrollArea>
          </CardContent>
        </Card>
      </div>
      {sessionToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-full max-w-md bg-gray-800 border-gray-700">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-white">
                Confirmar Eliminación
              </CardTitle>
              <CardDescription className="text-gray-400">
                ¿Estás seguro de que deseas eliminar esta sesión?
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-end">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white mr-2"
                  onClick={confirmDeleteSession}
                >
                  Confirmar
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-gray-600 hover:bg-gray-700"
                  onClick={cancelDeleteSession}
                >
                  Cancelar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {showCongratulations && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
          <Card className="w-[600px] h-[600px] overflow-hidden relative flex flex-col justify-center">
            <div
              className="absolute inset-0 bg-contain bg-center bg-no-repeat"
              style={{ backgroundImage: "url('/gato-gym.png')" }}
            >
              <div className="absolute inset-0 bg-black opacity-60" />{" "}
              {/* Capa de opacidad para mejorar la legibilidad */}
            </div>
            <div className="relative z-10 flex flex-col items-center justify-center text-center">
              <CardHeader>
                <CardTitle className="text-3xl font-bold text-white mb-2">
                  ¡Felicidades!
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-100">
                <p className="text-lg">
                  Has completado tu semana de entrenamiento. ¡Excelente trabajo!
                </p>
                <p className="mt-4 text-sm text-gray-400">
                  Sigue así y alcanzarás tus metas fitness.
                </p>
              </CardContent>
            </div>
          </Card>
        </div>
      )}
      <Fireworks active={active} />
      <div className="flex items-center justify-center p-4">
      <div className="w-1/2 mr-4">
        <label htmlFor="observaciones" className="block text-gray-700 font-bold mb-2">
          Ingrese sus observaciones:
        </label>
        <textarea
          id="observaciones"
          value={observaciones}
          onChange={(e) => setObservaciones(e.target.value)}
          className="w-full h-32 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50"
        />
      </div>
      <div className="w-1/2 ml-4">
        <button
          onClick={handleFinalizar}
          className="w-full h-20 bg-blue-500 hover:bg-blue-600 active:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 text-white font-semibold flex items-center justify-center"
        >
          <FaDumbbell className="w-4 h-4 mr-2" /> Finalizar
        </button>
      </div>
    </div>
      <FooterPag />
    </div>
  );
}
