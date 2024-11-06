// "use client";

// import { useState } from "react";
// import axios from "axios";
// import { Button } from "../../components/ui/button";
// import { Input } from "../../components/ui/input";
// import { Label } from "../../components/ui/label";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "../../components/ui/select";
// import {
//   Card,
//   CardContent,
//   CardHeader,
//   CardTitle,
// } from "../../components/ui/card";
// import { PlusCircle, Save } from "lucide-react";
// import { Toast } from "./ui/toast";
// import { useEffect } from "react";
// import { toast } from "../hooks/use-toast";
// import { FooterPag } from "./Footer";
// import NavBarTrainer from "./NavBarTrainer";

// // Tipos
// // type Client = {
// //   id: number
// //   dni: string
// //   name: string
// // }
// interface Client {
//   name: string;
//   lastname: string;
//   dni: string;
//   email: string;
//   phone: string;
//   goal: string;
//   gymName: string;
//   dniTrainer: string;
//   dniNutritionist: string;
//   id: number;
//   address: string; // Asegúrate de incluir 'address'
// }

// type Exercise = {
//   name: string;
//   reps: number;
//   sets: number;
// };

// type Session = {
//   id: number;
//   exercises: Exercise[];
// };

// type Routine = {
//   id: number;
//   name: string;
//   sessions: Session[];
// };

// type ClientRoutines = {
//   [clientId: number]: Routine[];
// };

// // Datos de ejemplo
// // const initialClients: Client[] = [
// //   { id: 1, name: "Juan Pérez", dni: "23232323" },
// //   { id: 2, name: "María García", dni: "1111323" },
// //   { id: 3, name: "Carlos Rodríguez", dni: "2222323" },
// // ]

// export default function DashboardTrainer() {
//   const [clients, setClients] = useState<Client[]>([]); // Inicializar como arreglo vacío
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null);
//   const [clientRoutines, setClientRoutines] = useState<ClientRoutines>({});
//   const [clientDni, setClientDni] = useState(""); // Inicializa clientDni
//   const [name, setName] = useState(""); // Inicializa name
//   const [message, setMessage] = useState("");
//   const [newRoutineName, setNewRoutineName] = useState("");
//   const email = localStorage.getItem("userEmail"); // O sessionStorage si usas ese
//   const token = localStorage.getItem("token"); // O sessionStorage si usas ese
//   const [error, setError] = useState("");

//   // const handleAddRoutine = () => {
//   //   if (selectedClient && newRoutineName) {
//   //     const newRoutine: Routine = {
//   //       id: Date.now(),
//   //       name: newRoutineName,
//   //       sessions: [],
//   //     }
//   //     setClientRoutines(prev => ({
//   //       ...prev,
//   //       [selectedClient.id]: [...(prev[selectedClient.id] || []), newRoutine]
//   //     }))
//   //     setNewRoutineName("")
//   //   }
//   // }

//   const handleAddSession = (routineId: number) => {
//     if (selectedClient) {
//       setClientRoutines((prev) => ({
//         ...prev,
//         [selectedClient.id]: prev[selectedClient.id].map((routine) =>
//           routine.id === routineId
//             ? {
//                 ...routine,
//                 sessions: [
//                   ...routine.sessions,
//                   { id: Date.now(), exercises: [] },
//                 ],
//               }
//             : routine
//         ),
//       }));
//     }
//   };

//   const saveExercise = async () => {
//     // Verificar que se tenga el ID de la rutina y que los datos del ejercicio sean válidos
//     if (!routineId || !sets || !reps || !exerciseName) {
//       setMessage("Por favor, proporciona todos los datos del ejercicio.");
//       return;
//     }
  
//     try {
//       // Realiza la llamada POST para crear la sesión
//       const response = await axios.post(
//         `http://localhost:8080/api/routines/${routineId}/sessions`,
//         {
//           sets: sets, // Número de sets
//           reps: reps, // Número de repeticiones
//           exerciseName: exerciseName, // Nombre del ejercicio
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`, // Incluir token de autenticación si es necesario
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       // Manejar la respuesta después de que la sesión ha sido creada exitosamente
//       setMessage("Ejercicio guardado exitosamente");
//       // Aquí puedes actualizar el estado local si es necesario, por ejemplo:
//       // setSessions(prevSessions => [...prevSessions, response.data]);
  
//     } catch (error) {
//       console.error("Error al guardar el ejercicio:", error);
//       setMessage("Error al guardar el ejercicio");
//     }
//   };
  

//   const handleAddExercise = (routineId: number, sessionId: number) => {
//     if (selectedClient) {
//       setClientRoutines((prev) => ({
//         ...prev,
//         [selectedClient.id]: prev[selectedClient.id].map((routine) =>
//           routine.id === routineId
//             ? {
//                 ...routine,
//                 sessions: routine.sessions.map((session) =>
//                   session.id === sessionId
//                     ? {
//                         ...session,
//                         exercises: [
//                           ...session.exercises,
//                           { name: "", reps: 0, sets: 0 },
//                         ],
//                       }
//                     : session
//                 ),
//               }
//             : routine
//         ),
//       }));
//     }
//   };

//   const handleUpdateExercise = (
//     routineId: number,
//     sessionId: number,
//     exerciseIndex: number,
//     field: keyof Exercise,
//     value: string | number
//   ) => {
//     if (selectedClient) {
//       setClientRoutines((prev) => ({
//         ...prev,
//         [selectedClient.id]: prev[selectedClient.id].map((routine) =>
//           routine.id === routineId
//             ? {
//                 ...routine,
//                 sessions: routine.sessions.map((session) =>
//                   session.id === sessionId
//                     ? {
//                         ...session,
//                         exercises: session.exercises.map((exercise, index) =>
//                           index === exerciseIndex
//                             ? { ...exercise, [field]: value }
//                             : exercise
//                         ),
//                       }
//                     : session
//                 ),
//               }
//             : routine
//         ),
//       }));
//     }
//   };

//   // const handleSaveRoutine = (routineId: number) => {
//   //   // Aquí iría la lógica para guardar la rutina en el backend
//   //   toast({
//   //     title: "Rutina guardada",
//   //     description: "La rutina se ha guardado exitosamente.",
//   //   })
//   // }

//   useEffect(() => {
//     // Definir una función asincrónica dentro del useEffect
//     const fetchClientsByTrainer = async () => {
//       if (!email) {
//         setError(
//           "No se encontró el email del entrenador en el almacenamiento."
//         );
//         return;
//       }

//       try {
//         // Realizar la solicitud al backend usando el email del entrenador
//         const response = await axios.get(
//           `http://localhost:8080/api/clients/by-trainer/${email}`,
//           {
//             headers: {
//               Authorization: `Bearer ${token}`,
//             },
//           }
//         );

//         setClients(response.data); // Actualizar el estado con los datos de los clientes
//       } catch (error) {
//         console.error("Error al obtener los clientes:", error);
//         setError("Hubo un problema al cargar los clientes.");
//       }
//     };

//     // Llamar a la función asincrónica
//     fetchClientsByTrainer();
//   }, []); // Ejecutar solo una vez al montar el componente
//   const createRoutine = async () => {
//     // Verificación inicial
//     if (!selectedClient || !newRoutineName) {
//       setMessage("Por favor, selecciona un cliente y proporciona un nombre para la rutina");
//       return;
//     }
  
//     try {
//       // Envío de datos al servidor para crear la rutina
//       const response = await axios.post(
//         "http://localhost:8080/api/routines",
//         {
//           clientDni: selectedClient.dni, // Usar DNI del cliente seleccionado
//           name: newRoutineName, // Usar nombre ingresado para la rutina
//         },
//         {
//           headers: {
//             Authorization: `Bearer ${token}`,
//             "Content-Type": "application/json",
//           },
//         }
//       );
  
//       // Actualización de la interfaz en caso de éxito
//       const newRoutine = {
//         id: response.data.id, // ID devuelto desde el servidor
//         name: newRoutineName,
//         sessions: [], // Inicializa con una lista vacía de sesiones
//       };
  
//       setClientRoutines((prev) => ({
//         ...prev,
//         [selectedClient.id]: [...(prev[selectedClient.id] || []), newRoutine],
//       }));
  
//       // Limpia el nombre de la rutina y muestra un mensaje de éxito
//       setNewRoutineName("");
//       setMessage("Rutina creada exitosamente");
//     } catch (error) {
//       console.error("Error al crear la rutina:", error);
//       setMessage("Error al crear la rutina");
//     }
//   };
  

//   const handleAddRoutine = () => {
//     createRoutine();
//   };

//   return (
//     <div
//       className="flex flex-col min-h-screen bg-cover bg-center"
//       style={{ backgroundImage: "url(/path/to/your/image.jpg)" }}
//     >
//       <NavBarTrainer></NavBarTrainer>
//       <div className="flex-grow p-4 space-y-6">
//         <h1 className="text-3xl font-bold text-primary">
//           Panel del Entrenador
//         </h1>

//         <Card>
//           <CardHeader>
//             <CardTitle>Selección de Cliente</CardTitle>
//           </CardHeader>
//           <CardContent>
//             <div className="grid w-full items-center gap-4">
//               <Label htmlFor="client-select">Seleccionar Cliente</Label>
//               <Select
//                 onValueChange={(value) => {
//                   const client = clients?.find((c) => c.id === parseInt(value));
//                   setSelectedClient(client || null);
//                 }}
//               >
//                 <SelectTrigger className="bg-white bg-opacity-100">
//                   <SelectValue placeholder="Seleccione un cliente" />
//                 </SelectTrigger>
//                 <SelectContent className="bg-white bg-opacity-100 shadow-lg">
//                   {clients?.map((client) => (
//                     <SelectItem key={client.id} value={client.id.toString()}>
//                       {client.name} {client.lastname} - DNI: {client.dni}{" "}
//                       {/* Mostrar nombre y DNI */}
//                     </SelectItem>
//                   ))}
//                 </SelectContent>
//               </Select>
//             </div>
//           </CardContent>
//         </Card>

//         {selectedClient && (
//           <Card>
//             <CardHeader>
//               <CardTitle>
//                 Rutinas de {selectedClient.name} {selectedClient.lastname}{" "}
//               </CardTitle>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center space-x-2">
//                 <Input
//                   placeholder="Nombre de la nueva rutina"
//                   value={newRoutineName}
//                   onChange={(e) => setNewRoutineName(e.target.value)}
//                 />

//                 {/* Botón para agregar la rutina */}
//                 <Button onClick={handleAddRoutine}>Agregar Rutina</Button>
//               </div>

//               {clientRoutines[selectedClient.id]?.map((routine) => (
//                 <Card key={routine.id}>
//                   <CardHeader className="flex flex-row items-center justify-between">
//                     <CardTitle className="text-xl">{routine.name}</CardTitle>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     {routine.sessions.map((session, sessionIndex) => (
//                       <Card key={session.id}>
//                         <CardHeader>
//                           <CardTitle className="text-lg">
//                             Sesión {sessionIndex + 1}
//                           </CardTitle>
//                         </CardHeader>
//                         <CardContent className="space-y-2">
//                           {session.exercises.map((exercise, exerciseIndex) => (
//                             <div
//                               key={exerciseIndex}
//                               className="grid grid-cols-3 gap-2"
//                             >
//                               <Input
//                                 placeholder="Ejercicio"
//                                 value={exercise.name}
//                                 onChange={(e) =>
//                                   handleUpdateExercise(
//                                     routine.id,
//                                     session.id,
//                                     exerciseIndex,
//                                     "name",
//                                     e.target.value
//                                   )
//                                 }
//                               />
//                               <Input
//                                 type="number"
//                                 placeholder="Repeticiones"
//                                 value={exercise.reps}
//                                 onChange={(e) =>
//                                   handleUpdateExercise(
//                                     routine.id,
//                                     session.id,
//                                     exerciseIndex,
//                                     "reps",
//                                     parseInt(e.target.value)
//                                   )
//                                 }
//                               />
//                               <Input
//                                 type="number"
//                                 placeholder="Series"
//                                 value={exercise.sets}
//                                 onChange={(e) =>
//                                   handleUpdateExercise(
//                                     routine.id,
//                                     session.id,
//                                     exerciseIndex,
//                                     "sets",
//                                     parseInt(e.target.value)
//                                   )
//                                 }
//                               />
//                                        <Button
//                             variant="outline"
//                             size="sm"
//                             className="w-full"
//                           >
//                             <PlusCircle className="w-4 h-4 mr-2" />
//                             Guardar ejercicio
//                           </Button>
//                             </div>
//                           ))}
//                           <Button
//                             onClick={() =>
//                               handleAddExercise(routine.id, session.id)
//                             }
//                             variant="outline"
//                             size="sm"
//                             className="w-full"
//                           >
//                             <PlusCircle className="w-4 h-4 mr-2" />
//                             Agregar Ejercicio
//                           </Button>
//                         </CardContent>
//                       </Card>
//                     ))}
//                     <Button
//                       onClick={() => handleAddSession(routine.id)}
//                       variant="outline"
//                       className="w-full"
//                     >
//                       <PlusCircle className="w-4 h-4 mr-2" />
//                       Agregar Sesión
//                     </Button>
//                   </CardContent>
//                 </Card>
//               ))}
//             </CardContent>
//           </Card>
//         )}
//       </div>
//       <FooterPag />
//     </div>
//   );
// }

// function jwt_decode(token: string) {
//   throw new Error("Function not implemented.");
// }

// function fetchClientsByTrainer() {
//   throw new Error("Function not implemented.");
// }
