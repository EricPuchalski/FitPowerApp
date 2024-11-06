"use client";

import { useEffect, useState } from "react";
import { FooterPag } from "./Footer";
import { motion } from "framer-motion";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import { ScrollArea } from "../../components/ui/scroll-area";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordion";
import { Clock, Dumbbell, Play } from "lucide-react";
import NavBarTrainer from "./NavBarTrainer";
import { NavBarClient } from "./NavBarClient";

const baseUrl = 'http://localhost:8080/api/routines/client/email/';
const clientUrl = 'http://localhost:8080/api/clients/email/';

// Función para obtener las rutinas del cliente
async function getClientRoutines(email: string) {
  try {
    const response = await fetch(`${baseUrl}${email}`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener las rutinas del cliente:', error);
    throw error;
  }
}

// Función para obtener los datos del cliente
async function getClientData(email: string) {
  try {
    const response = await fetch(`${clientUrl}${email}`);
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error al obtener los datos del cliente:', error);
    throw error;
  }
}

// Tipos de datos
type Session = {
  id: number;
  exerciseName: string;
  sets: number;
  reps: number;
  restTime: number;
};

type Routine = {
  id: number;
  name: string;
  sessions: Session[];
};

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

export default function TrainingClient() {
  const [selectedRoutine, setSelectedRoutine] = useState<Routine | null>(null)
  const [routines, setRoutines] = useState<Routine[]>([]);
  const [client, setClient] = useState<Client | null>(null);
  const [error, setError] = useState<string | null>(null);

  const email = 'damian_betum@gmail.com'; // Reemplaza con el email del cliente

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const data = await getClientRoutines(email);
        setRoutines(data);
      } catch (error) {
        setError('Error al obtener las rutinas del cliente');
      }
    };

    const fetchClientData = async () => {
      try {
        const data = await getClientData(email);
        setClient(data);
        console.log(data);
      } catch (error) {
        setError('Error al obtener los datos del cliente');
      }
    };

    fetchRoutines();
    fetchClientData();

    // Polling every 5 seconds
    const intervalId = setInterval(async () => {
      await fetchRoutines();
      await fetchClientData();
    }, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [email]);

  const handleStartRoutine = (routine: Routine) => {
    setSelectedRoutine(routine)
  }

 

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#220901] relative">
      <div className="container p-4 bg-gradient-to-br from-gray-900 to-gray-800 min-h-screen text-white center">
        <NavBarClient />
        <h1 className="text-4xl font-bold my-8 text-center">
          {client?.name} {client?.lastname} este es tu entrenamiento personalizado!
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {routines.map((routine) => (
            <motion.div
              key={routine.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gray-800 border-gray-700">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">
                    {routine.name}
                  </CardTitle>
                  <CardDescription className="text-gray-400">
                    {routine.sessions.length} ejercicios
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="exercises">
                      <AccordionTrigger className="text-blue-400 hover:text-blue-300">
                        Ver ejercicios
                      </AccordionTrigger>
                      <AccordionContent>
                        <ScrollArea className="h-[200px] w-full rounded-md border border-gray-700 p-4">
                          {routine.sessions.map((session) => (
                            <div key={session.id} className="mb-4 last:mb-0">
                              <h4 className="font-semibold text-lg mb-2">
                                {session.exerciseName}
                              </h4>
                              <div className="flex justify-between text-sm text-gray-400">
                                <span className="flex items-center">
                                  <Dumbbell className="w-4 h-4 mr-1" />
                                  {session.sets} x {session.reps}
                                </span>
                                <span className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {session.restTime}s descanso
                                </span>
                              </div>
                            </div>
                          ))}
                        </ScrollArea>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>
                </CardContent>
                <CardFooter>
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    onClick={() => handleStartRoutine(routine)}
                  >
                    <Play className="w-4 h-4 mr-2" /> Comenzar Rutina
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          ))}
        </div>
        {selectedRoutine && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-md bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle className="text-2xl font-bold">
                  {selectedRoutine.name}
                </CardTitle>
                <CardDescription className="text-gray-400">
                  ¡Comienza tu entrenamiento!
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-lg mb-4">
                  Has seleccionado la rutina: {selectedRoutine.name}
                </p>
                <p className="text-gray-400">
                  Esta rutina consta de {selectedRoutine.sessions.length}{" "}
                  ejercicios. ¡Prepárate para un gran entrenamiento!
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button
                  className="bg-green-600 hover:bg-green-700 text-white mr-2"
                  onClick={() => {
                    // Aquí iría la lógica para iniciar la rutina
                    alert(
                      "¡Rutina iniciada! Buena suerte con tu entrenamiento."
                    );
                  }}
                >
                  Confirmar Inicio
                </Button>
                <Button
                  variant="outline"
                  className="bg-transparent text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => setSelectedRoutine(null)}
                >
                  Cancelar
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        )}
        <FooterPag></FooterPag>
      </div>
     
    </div>

  );
}