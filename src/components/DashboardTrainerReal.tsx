// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "../../components/ui/button"
// import { Input } from "../../components/ui/input"
// import { Label } from "../../components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
// import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
// import { PlusCircle, Save } from "lucide-react"
// import { Toast } from "../../components/ui/toast"
// import { toast } from "../hooks/use-toast"

// // Tipos
// type Client = {
//   id: number
//   name: string
//   dni: string
// }

// type Exercise = {
//   id: number
//   name: string
// }

// type Session = {
//   id: number
//   exerciseId: number
//   repetitions: number
//   sets: number
// }

// type Routine = {
//   id: number
//   name: string
//   clientDni: string
//   sessions: Session[]
// }

// // API simulada
// const api = {
//   getClients: async (): Promise<Client[]> => {
//     // Simular una llamada a la API
//     await new Promise(resolve => setTimeout(resolve, 500))
//     return [
//       { id: 1, name: "Juan Pérez", dni: "12345678" },
//       { id: 2, name: "María García", dni: "87654321" },
//       { id: 3, name: "Carlos Rodríguez", dni: "11223344" },
//     ]
//   },
//   getExercises: async (): Promise<Exercise[]> => {
//     // Simular una llamada a la API
//     await new Promise(resolve => setTimeout(resolve, 500))
//     return [
//       { id: 1, name: "Sentadillas" },
//       { id: 2, name: "Flexiones" },
//       { id: 3, name: "Abdominales" },
//     ]
//   },
//   createRoutine: async (name: string, clientDni: string): Promise<Routine> => {
//     // Simular una llamada a la API
//     await new Promise(resolve => setTimeout(resolve, 500))
//     return { id: Date.now(), name, clientDni, sessions: [] }
//   },
//   createSession: async (routineId: number, exerciseId: number, repetitions: number, sets: number): Promise<Session> => {
//     // Simular una llamada a la API
//     await new Promise(resolve => setTimeout(resolve, 500))
//     return { id: Date.now(), exerciseId, repetitions, sets }
//   },
// }

// export default function DashboardTrainer() {
//   const [clients, setClients] = useState<Client[]>([])
//   const [exercises, setExercises] = useState<Exercise[]>([])
//   const [selectedClient, setSelectedClient] = useState<Client | null>(null)
//   const [routines, setRoutines] = useState<Routine[]>([])
//   const [newRoutineName, setNewRoutineName] = useState("")
//   const [newSession, setNewSession] = useState<{ exerciseId: number, repetitions: number, sets: number }>({
//     exerciseId: 0,
//     repetitions: 0,
//     sets: 0
//   })

//   useEffect(() => {
//     const fetchData = async () => {
//       const [clientsData, exercisesData] = await Promise.all([
//         api.getClients(),
//         api.getExercises()
//       ])
//       setClients(clientsData)
//       setExercises(exercisesData)
//     }
//     fetchData()
//   }, [])

//   const handleAddRoutine = async () => {
//     if (selectedClient && newRoutineName) {
//       try {
//         const newRoutine = await api.createRoutine(newRoutineName, selectedClient.dni)
//         setRoutines([...routines, newRoutine])
//         setNewRoutineName("")
//         toast({
//           title: "Rutina creada",
//           description: "La nueva rutina se ha creado exitosamente.",
//         })
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "No se pudo crear la rutina. Intente nuevamente.",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   const handleAddSession = async (routineId: number) => {
//     if (newSession.exerciseId && newSession.repetitions && newSession.sets) {
//       try {
//         const session = await api.createSession(
//           routineId,
//           newSession.exerciseId,
//           newSession.repetitions,
//           newSession.sets
//         )
//         setRoutines(routines.map(routine =>
//           routine.id === routineId
//             ? { ...routine, sessions: [...routine.sessions, session] }
//             : routine
//         ))
//         setNewSession({ exerciseId: 0, repetitions: 0, sets: 0 })
//         toast({
//           title: "Sesión agregada",
//           description: "La nueva sesión se ha agregado exitosamente.",
//         })
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "No se pudo agregar la sesión. Intente nuevamente.",
//           variant: "destructive",
//         })
//       }
//     }
//   }

//   return (
//     <div className="container mx-auto p-4 space-y-6">
//       <h1 className="text-3xl font-bold text-primary">Panel del Entrenador</h1>
      
//       <Card>
//         <CardHeader>
//           <CardTitle>Selección de Cliente</CardTitle>
//         </CardHeader>
//         <CardContent>
//           <div className="grid w-full items-center gap-4">
//             <Label htmlFor="client-select">Seleccionar Cliente</Label>
//             <Select
//               onValueChange={(value) => {
//                 const client = clients.find((c) => c.id === parseInt(value))
//                 setSelectedClient(client || null)
//               }}
//             >
//               <SelectTrigger>
//                 <SelectValue placeholder="Seleccione un cliente" />
//               </SelectTrigger>
//               <SelectContent>
//                 {clients.map((client) => (
//                   <SelectItem key={client.id} value={client.id.toString()}>
//                     {client.name} (DNI: {client.dni})
//                   </SelectItem>
//                 ))}
//               </SelectContent>
//             </Select>
//           </div>
//         </CardContent>
//       </Card>

//       {selectedClient && (
//         <Card>
//           <CardHeader>
//             <CardTitle>Rutinas de {selectedClient.name}</CardTitle>
//           </CardHeader>
//           <CardContent className="space-y-4">
//             <div className="flex items-center space-x-2">
//               <Input
//                 placeholder="Nombre de la nueva rutina"
//                 value={newRoutineName}
//                 onChange={(e) => setNewRoutineName(e.target.value)}
//               />
//               <Button onClick={handleAddRoutine}>Agregar Rutina</Button>
//             </div>

//             {routines.map((routine) => (
//               <Card key={routine.id}>
//                 <CardHeader>
//                   <CardTitle className="text-xl">{routine.name}</CardTitle>
//                 </CardHeader>
//                 <CardContent className="space-y-4">
//                   {routine.sessions.map((session, index) => (
//                     <Card key={session.id}>
//                       <CardContent className="p-4">
//                         <p>Sesión {index + 1}</p>
//                         <p>Ejercicio: {exercises.find(e => e.id === session.exerciseId)?.name}</p>
//                         <p>Repeticiones: {session.repetitions}</p>
//                         <p>Series: {session.sets}</p>
//                       </CardContent>
//                     </Card>
//                   ))}
//                   <Card>
//                     <CardContent className="p-4 space-y-2">
//                       <Select
//                         onValueChange={(value) => setNewSession({ ...newSession, exerciseId: parseInt(value) })}
//                       >
//                         <SelectTrigger>
//                           <SelectValue placeholder="Seleccione un ejercicio" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {exercises.map((exercise) => (
//                             <SelectItem key={exercise.id} value={exercise.id.toString()}>
//                               {exercise.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                       <Input
//                         type="number"
//                         placeholder="Repeticiones"
//                         value={newSession.repetitions}
//                         onChange={(e) => setNewSession({ ...newSession, repetitions: parseInt(e.target.value) })}
//                       />
//                       <Input
//                         type="number"
//                         placeholder="Series"
//                         value={newSession.sets}
//                         onChange={(e) => setNewSession({ ...newSession, sets: parseInt(e.target.value) })}
//                       />
//                       <Button
//                         onClick={() => handleAddSession(routine.id)}
//                         variant="outline"
//                         size="sm"
//                         className="w-full"
//                       >
//                         <PlusCircle className="w-4 h-4 mr-2" />
//                         Agregar Sesión
//                       </Button>
//                     </CardContent>
//                   </Card>
//                 </CardContent>
//               </Card>
//             ))}
//           </CardContent>
//         </Card>
//       )}
//     </div>
//   )
// }