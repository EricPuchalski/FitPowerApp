"use client";

import { useEffect, useState } from "react";
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

type ClientStatus = "ACTIVE" | "INACTIVE" | "SUSPENDED";

type Trainer = {
  id: string;
  lastname: string;
  dni: string;
};

type Nutritionist = {
  id: string;
  lastname: string;
  dni: string;
};

type Gym = {
  id: string;
  name: string;
};

interface Client {
  name: string;
  lastname: string;
  dni: string;
  email: string;
  phone: string;
  goal: string;
  gymName: string;
  dniTrainer: string;
  dniNutritionist: string;
  id: string;
  address: string; // Asegúrate de incluir 'address'
}

export default function ClientCrud() {
  const [clients, setClients] = useState<Client[]>([]); // Inicializar como arreglo vacío
  const [trainers, setTrainers] = useState<Trainer[]>([]); // Inicializar como arreglo vacío
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]); // Inicializar como arreglo vacío
  const [gyms, setGyms] = useState<Gym[]>([]); // Inicializar como arreglo vacío

  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const token = localStorage.getItem("token");

  const [formData, setFormData] = useState<Client>({
    name: "",
    lastname: "",
    dni: "",
    email: "",
    phone: "",
    goal: "",
    gymName: "",
    dniTrainer: "",
    dniNutritionist: "",
    id: "", // o podría ser un valor único generado
    address: "", // Incluye el campo 'address'
  });

  useEffect(() => {
    // Fetch Clients
    fetch("http://localhost:8080/api/clients", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setClients(data);
      })
      .catch((error) => console.error("Error al obtener los clientes:", error));
    fetch("http://localhost:8080/api/nutritionists", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setNutritionists(data);
      })
      .catch((error) => console.error("Error al obtener los clientes:", error));

    // Fetch Trainers
    fetch("http://localhost:8080/api/trainers", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        setTrainers(data);
      })
      .catch((error) =>
        console.error("Error al obtener los entrenadores:", error)
      );
      fetch("http://localhost:8080/api/gyms", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          setGyms(data);
        })
        .catch((error) =>
          console.error("Error al obtener los entrenadores:", error)
        );
  }, []); // El array de dependencias está vacío, así que este efecto solo se ejecuta una vez, al montarse el componente

  const handleCreateClient = (newClient: Client) => {
    setClients((prevClients) => [...prevClients, newClient]);
    setIsNewClientDialogOpen(false);
  };

  const handleEditClient = (updatedClient: Client) => {
    setClients((prevClients) =>
      prevClients.map((client) =>
        client.id === updatedClient.id ? updatedClient : client
      )
    );
    setEditingClient(null);
  };

  const handleDeleteClient = (id: string) => {
    setClients((prevClients) =>
      prevClients.filter((client) => client.id !== id)
    );
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
                      {client.dniTrainer || "No tiene"}
                    </td>
                    <td className="text-[#03396c] p-2 text-center">
                      {client.dniNutritionist || "No tiene"}
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
                          onClick={() => handleDeleteClient(client.id)}
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

      {(isNewClientDialogOpen || editingClient) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#03396c] mb-4">
              {editingClient ? "Editar Cliente" : "Crear Nuevo Cliente"}
            </h3>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                if (editingClient) {
                  handleEditClient({
                    ...editingClient,
                    ...formData,
                  });
                } else {
                  handleCreateClient({
                    ...formData,
                  });
                }
                setIsNewClientDialogOpen(false);
                setEditingClient(null);
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
            required
            className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
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

        <div>
          <label htmlFor="entrenador" className="flex items-center text-[#03396c]">
            <User className="w-4 h-4 mr-2" /> Entrenador
          </label>
          <select
            id="entrenador"
            name="dniTrainer"
            value={formData.dniTrainer}
            onChange={(e) => setFormData({ ...formData, dniTrainer: e.target.value })}
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

        <div>
          <label htmlFor="nutricionista" className="flex items-center text-[#03396c]">
            <User className="w-4 h-4 mr-2" /> Nutricionista
          </label>
          <select
            id="nutricionista"
            name="dniNutritionist"
            value={formData.dniNutritionist}
            onChange={(e) => setFormData({ ...formData, dniNutritionist: e.target.value })}
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
      </div>
      <div className="flex justify-end">
        <button
          type="button"
          onClick={() => {
            setIsNewClientDialogOpen(false);
            setEditingClient(null);
          }}
          className="bg-[#e74c3c] text-white px-4 py-2 rounded mr-2"
        >
          Cancelar
        </button>
        <button
          type="submit"
          className="bg-[#2ecc71] text-white px-4 py-2 rounded"
        >
          {editingClient ? 'Actualizar Cliente' : 'Crear Cliente'}
        </button>
      </div>
    </form>
          </div>
        </div>
      )}
    </div>
  );
}
