"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Dumbbell,
  Mail,
  Phone,
  MapPin,
  Target,
  Building,
  UserCheck,
  Apple,
} from "lucide-react";
import ClientService from '../services/ClientService';
import { Client } from '../model/Client'; // Asegúrate de importar tus modelos

export default function ClientCrud() {
  const token = localStorage.getItem("token") || "";
  const {
    clients,
    trainers,
    nutritionists,
    gyms,
    fetchClients,
    fetchTrainers,
    fetchNutritionists,
    fetchGyms,
    createClient,
    assignGymToClient,
    assignNutritionistToClient,
    assignTrainerToClient,
  } = ClientService();

  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [isAssignGymDialogOpen, setIsAssignGymDialogOpen] = useState(false);
  const [isAssignNutritionistDialogOpen, setIsAssignNutritionistDialogOpen] = useState(false);
  const [isAssignTrainerDialogOpen, setIsAssignTrainerDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [formData, setFormData] = useState<Client>({
    id: 0,
    name: "",
    lastname: "",
    dni: "",
    phone: "",
    address: "",
    email: "",
    goal: "",
    gymName: "",
    trainerDni: "",
    nutritionistDni: "",
    initialPhysicalState: "",
  });

  useEffect(() => {
    if (token) {
      fetchClients(token);
      fetchTrainers(token);
      fetchNutritionists(token);
      fetchGyms(token);
    }
  }, [token]);

  const handleCreateClient = async (newClient: Client) => {
    console.log(newClient);
    
    if (token) {
      const createdClient = await createClient(newClient, token);
      if (createdClient) {
        alert("Cliente creado exitosamente");
        setFormData(createdClient);
        setIsNewClientDialogOpen(false);
        setIsAssignGymDialogOpen(true);
      }
    }
  };

  const handleAssignGym = (gymName: string) => {
    if (token && formData.dni) {
      assignGymToClient(gymName, formData.dni, token);
      setIsAssignGymDialogOpen(false);
      setIsAssignNutritionistDialogOpen(true);
    }
  };

  const handleAssignNutritionist = (nutritionistDni: string) => {
    if (token && formData.dni) {
      assignNutritionistToClient(nutritionistDni, formData.dni, token);
      setIsAssignNutritionistDialogOpen(false);
      setIsAssignTrainerDialogOpen(true);
    }
  };

  const handleAssignTrainer = (trainerDni: string) => {
    if (token && formData.dni) {
      assignTrainerToClient(trainerDni, formData.dni, token);
      setIsAssignTrainerDialogOpen(false);
      setEditingClient(null);
    }
  };

  const handleDisableClient = (clientDni: string) => {
    const confirmDisable = window.confirm("¿Estás seguro de que deseas inhabilitar este cliente?");
    if (confirmDisable && token) {
      disableClient(clientDni, token);
    }
  };

  return (
    <div className="min-h-screen bg-[url('https://img.freepik.com/free-photo/3d-gym-equipment_23-2151114137.jpg')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4 py-8 bg-[#03396c]/90 min-h-screen">
        <div className="mb-8 border border-[#65c6c4] rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#03396c] to-[#65c6c4] p-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <User className="mr-2" /> Gestión de Clientes FITPOWER
            </h2>
          </div>
          <div className="pt-6 bg-[#f2e6b6] p-4">
            <button
              onClick={() => setIsNewClientDialogOpen(true)}
              className="bg-[#b2d3a7] hover:bg-[#65c6c4] text-[#03396c] px-4 py-2 rounded flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
            </button>
          </div>
        </div>

        <div className="border border-[#65c6c4] rounded-lg overflow-hidden">
          <div className="bg-[#f2e6b6] p-4">
            <table className="w-full">
              <thead>
                <tr className="bg-[#65c6c4]">
                  <th className="font-bold text-[#03396c] p-2">Nombre</th>
                  <th className="font-bold text-[#03396c] p-2">Email</th>
                  <th className="font-bold text-[#03396c] p-2">Teléfono</th>
                  <th className="font-bold text-[#03396c] p-2">Objetivo</th>
                  <th className="font-bold text-[#03396c] p-2">Gimnasio</th>
                  <th className="font-bold text-[#03396c] p-2">Entrenador</th>
                  <th className="font-bold text-[#03396c] p-2">
                    Nutricionista
                  </th>
                  <th className="font-bold text-[#03396c] p-2 ">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#b2d3a7]">
                    <td className="font-medium text-[#03396c] p-2 text-center">
                      {`${client.name || "No tiene"} ${
                        client.lastname || "No tiene"
                      }`}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.email || "No tiene"}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.phone || "No tiene"}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.goal || "No tiene"}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.gymName || "No tiene"}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.trainerDni || "No tiene"}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.nutritionistDni || "No tiene"}
                    </td>
                    <td className="p-2">
                      <div className="flex space-x-2 ">
                        <button
                          onClick={() => setEditingClient(client)}
                          className="text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded "
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDisableClient(client.dni)}
                          className="text-[#f8c471] hover:text-[#f2e6b6] hover:bg-[#f8c471] p-1 rounded"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {isNewClientDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#03396c] mb-4">
              Crear Nuevo Cliente
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleCreateClient(formData);
              }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nombre" className="flex items-center text-[#03396c]">
                    <User className="w-4 h-4 mr-2" /> Nombre
                  </label>
                  <input
                    id="nombre"
                    name="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="apellido" className="flex items-center text-[#03396c]">
                    <User className="w-4 h-4 mr-2" /> Apellido
                  </label>
                  <input
                    id="apellido"
                    name="lastname"
                    value={formData.lastname}
                    onChange={(e) => setFormData({ ...formData, lastname: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="dni" className="flex items-center text-[#03396c]">
                    <User className="w-4 h-4 mr-2" /> DNI
                  </label>
                  <input
                    id="dni"
                    name="dni"
                    value={formData.dni}
                    onChange={(e) => setFormData({ ...formData, dni: e.target.value })}
                    // required
                    // pattern=" ^[0-9]{7,8}$"
                    // title="El DNI debe tener entre 7 y 8 dígitos numericos"
                    // className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="email" className="flex items-center text-[#03396c]">
                    <Mail className="w-4 h-4 mr-2" /> Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="telefono" className="flex items-center text-[#03396c]">
                    <Phone className="w-4 h-4 mr-2" /> Teléfono
                  </label>
                  <input
                    id="telefono"
                    name="phone"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="direccion" className="flex items-center text-[#03396c]">
                    <MapPin className="w-4 h-4 mr-2" /> Dirección
                  </label>
                  <input
                    id="direccion"
                    name="address"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="objetivo" className="flex items-center text-[#03396c]">
                    <Target className="w-4 h-4 mr-2" /> Objetivo
                  </label>
                  <input
                    id="objetivo"
                    name="goal"
                    value={formData.goal}
                    onChange={(e) => setFormData({ ...formData, goal: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
                <div>
                  <label htmlFor="estadoFisico" className="flex items-center text-[#03396c]">
                    <Dumbbell className="w-4 h-4 mr-2" /> Estado Físico Inicial
                  </label>
                  <input
                    id="estadoFisico"
                    name="initialPhysicalState"
                    value={formData.initialPhysicalState}
                    onChange={(e) => setFormData({ ...formData, initialPhysicalState: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsNewClientDialogOpen(false)}
                  className="bg-[#e74c3c] text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2ecc71] text-white px-4 py-2 rounded"
                >
                  Crear Cliente
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignGymDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#03396c] mb-4">
              Asignar Gimnasio
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAssignGym(formData.gymName);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="gimnasio" className="flex items-center text-[#03396c]">
                  <Building className="w-4 h-4 mr-2" /> Gimnasio
                </label>
                <select
                  id="gimnasio"
                  name="gymName"
                  value={formData.gymName}
                  onChange={(e) => setFormData({ ...formData, gymName: e.target.value })}
                  required
                  className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                >
                  <option value="">Selecciona un gimnasio</option>
                  {gyms.map((gym) => (
                    <option key={gym.id} value={gym.name}>
                      {gym.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAssignGymDialogOpen(false)}
                  className="bg-[#e74c3c] text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2ecc71] text-white px-4 py-2 rounded"
                >
                  Asignar Gimnasio
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignNutritionistDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#03396c] mb-4">
              Asignar Nutricionista
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleAssignNutritionist(formData.nutritionistDni);
              }}
              className="space-y-4"
            >
              <div>
                <label htmlFor="nutricionista" className="flex items-center text-[#03396c]">
                  <User className="w-4 h-4 mr-2" /> Nutricionista
                </label>
                <select
                  id="nutricionista"
                  name="nutritionistDni"
                  value={formData.nutritionistDni}
                  onChange={(e) => setFormData({ ...formData, nutritionistDni: e.target.value })}
                  required
                  className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                >
                  <option value="">Selecciona un nutricionista</option>
                  {nutritionists.map((nutritionist) => (
                    <option key={nutritionist.dni} value={nutritionist.dni}>
                      {nutritionist.lastname} - DNI: {nutritionist.dni}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setIsAssignNutritionistDialogOpen(false)}
                  className="bg-[#e74c3c] text-white px-4 py-2 rounded mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-[#2ecc71] text-white px-4 py-2 rounded"
                >
                  Asignar Nutricionista
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {isAssignTrainerDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#03396c] mb-4">
              Asignar Entrenador
            </h3>
            <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleAssignTrainer(formData.trainerDni);
                }}
                className="space-y-4"
              >
                <div>
                  <label htmlFor="entrenador" className="flex items-center text-[#03396c]">
                    <User className="w-4 h-4 mr-2" /> Entrenador
                  </label>
                  <select
                    id="entrenador"
                    name="trainerDni"
                    value={formData.trainerDni}
                    onChange={(e) => setFormData({ ...formData, trainerDni: e.target.value })}
                    required
                    className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
                  >
                    <option value="">Selecciona un entrenador</option>
                    {trainers.map((trainer) => (
                      <option key={trainer.dni} value={trainer.dni}>
                        {trainer.lastname} - DNI: {trainer.dni}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsAssignTrainerDialogOpen(false)}
                    className="bg-[#e74c3c] text-white px-4 py-2 rounded mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#2ecc71] text-white px-4 py-2 rounded"
                  >
                    Asignar Entrenador
                  </button>
                </div>
              </form>
            </div>
          </div>
        
      )}
    </div>
  );
}

function disableClient(clientDni: string, token: string) {
  throw new Error("Function not implemented.");
}

