"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, User, Dumbbell, Mail, Phone, MapPin, Target, Building, UserCheck, Apple } from 'lucide-react'

type ClientStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

type Trainer = {
  id: string
  nombre: string
  apellido: string
}

type Nutritionist = {
  id: string
  nombre: string
  apellido: string
}

type Client = {
  id: string
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string
  direccion: string
  initState: ClientStatus
  currentState: ClientStatus
  goal: string
  gym: string
  trainerId: string
  nutritionistId: string
}

const initialTrainers: Trainer[] = [
  { id: '1', nombre: 'Carlos', apellido: 'Entrenador' },
  { id: '2', nombre: 'Laura', apellido: 'Entrenadora' },
  { id: '3', nombre: 'Javier', apellido: 'Fitness' },
]

const initialNutritionists: Nutritionist[] = [
  { id: '1', nombre: 'Ana', apellido: 'Nutricionista' },
  { id: '2', nombre: 'Luis', apellido: 'Dietista' },
  { id: '3', nombre: 'María', apellido: 'Nutrióloga' },
]

const initialClients: Client[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678A',
    email: 'juan@example.com',
    telefono: '123456789',
    direccion: 'Calle Fitness 123',
    initState: 'ACTIVE',
    currentState: 'ACTIVE',
    goal: 'Perder peso',
    gym: 'FITPOWER Central',
    trainerId: '1',
    nutritionistId: '1'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    dni: '87654321B',
    email: 'maria@example.com',
    telefono: '987654321',
    direccion: 'Avenida Salud 456',
    initState: 'ACTIVE',
    currentState: 'SUSPENDED',
    goal: 'Ganar masa muscular',
    gym: 'FITPOWER Norte',
    trainerId: '2',
    nutritionistId: '2'
  },
]

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleCreateClient = (newClient: Client) => {
    setClients([...clients, newClient])
    setIsNewClientDialogOpen(false)
  }

  const handleEditClient = (updatedClient: Client) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client))
    setEditingClient(null)
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id))
  }

  const getTrainerName = (trainerId: string) => {
    const trainer = initialTrainers.find(t => t.id === trainerId)
    return trainer ? `${trainer.nombre} ${trainer.apellido}` : 'No asignado'
  }

  const getNutritionistName = (nutritionistId: string) => {
    const nutritionist = initialNutritionists.find(n => n.id === nutritionistId)
    return nutritionist ? `${nutritionist.nombre} ${nutritionist.apellido}` : 'No asignado'
  }

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
                  <th className="font-bold text-[#03396c] p-2">Estado</th>
                  <th className="font-bold text-[#03396c] p-2">Objetivo</th>
                  <th className="font-bold text-[#03396c] p-2">Gimnasio</th>
                  <th className="font-bold text-[#03396c] p-2">Entrenador</th>
                  <th className="font-bold text-[#03396c] p-2">Nutricionista</th>
                  <th className="font-bold text-[#03396c] p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {clients.map((client) => (
                  <tr key={client.id} className="hover:bg-[#b2d3a7]">
                    <td className="font-medium text-[#03396c] p-2">{`${client.nombre} ${client.apellido}`}</td>
                    <td className="text-[#03396c] p-2">{client.email}</td>
                    <td className="text-[#03396c] p-2">{client.telefono}</td>
                    <td className="text-[#03396c] p-2">{client.currentState}</td>
                    <td className="text-[#03396c] p-2">{client.goal}</td>
                    <td className="text-[#03396c] p-2">{client.gym}</td>
                    <td className="text-[#03396c] p-2">{getTrainerName(client.trainerId)}</td>
                    <td className="text-[#03396c] p-2">{getNutritionistName(client.nutritionistId)}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingClient(client)}
                          className="text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded"
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
              {editingClient ? 'Editar Cliente' : 'Crear Nuevo Cliente'}
            </h3>
            <ClientForm 
              onSubmit={editingClient ? handleEditClient : handleCreateClient} 
              initialData={editingClient || undefined}
              onClose={() => {
                setIsNewClientDialogOpen(false)
                setEditingClient(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

type ClientFormProps = {
  onSubmit: (client: Client) => void
  initialData?: Client
  onClose: () => void
}

function ClientForm({ onSubmit, initialData, onClose }: ClientFormProps) {
  const [formData, setFormData] = useState<Client>(
    initialData || {
      id: '',
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      direccion: '',
      initState: 'ACTIVE',
      currentState: 'ACTIVE',
      goal: '',
      gym: '',
      trainerId: '',
      nutritionistId: ''
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit({ ...formData, id: initialData ? formData.id : Date.now().toString() })
    onClose()
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="nombre" className="flex items-center text-[#03396c]">
            <User className="w-4 h-4 mr-2" /> Nombre
          </label>
          <input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="apellido" className="flex items-center text-[#03396c]">
            <User className="w-4 h-4 mr-2" /> Apellido
          </label>
          <input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="dni" className="flex items-center text-[#03396c]">
            <User className="w-4 h-4 mr-2" /> DNI
          </label>
          <input id="dni" name="dni" value={formData.dni} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="email" className="flex items-center text-[#03396c]">
            <Mail className="w-4 h-4 mr-2" /> Email
          </label>
          <input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="telefono" className="flex items-center text-[#03396c]">
            <Phone className="w-4 h-4 mr-2" /> Teléfono
          </label>
          <input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="direccion" className="flex items-center text-[#03396c]">
            <MapPin className="w-4 h-4 mr-2" /> Dirección
          </label>
          <input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="currentState" className="flex items-center text-[#03396c]">
            <UserCheck className="w-4 h-4 mr-2" /> Estado Actual
          </label>
          <select
            id="currentState"
            name="currentState"
            value={formData.currentState}
            onChange={handleChange}
            className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
          >
            <option value="ACTIVE">Activo</option>
            <option value="INACTIVE">Inactivo</option>
            <option value="SUSPENDED">Suspendido</option>
          </select>
        </div>
        <div>
          <label htmlFor="goal" className="flex items-center text-[#03396c]">
            <Target className="w-4  h-4 mr-2" /> Objetivo
          </label>
          <input id="goal" name="goal" value={formData.goal} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="gym" className="flex items-center text-[#03396c]">
            <Building className="w-4 h-4 mr-2" /> Gimnasio
          </label>
          <select
            id="gym"
            name="gym"
            value={formData.gym}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
          >
            <option value="">Seleccionar gimnasio</option>
            <option value="FITPOWER Central">FITPOWER Central</option>
            <option value="FITPOWER Norte">FITPOWER Norte</option>
            <option value="FITPOWER Sur">FITPOWER Sur</option>
          </select>
        </div>
        <div>
          <label htmlFor="trainerId" className="flex items-center text-[#03396c]">
            <Dumbbell className="w-4 h-4 mr-2" /> Entrenador
          </label>
          <select
            id="trainerId"
            name="trainerId"
            value={formData.trainerId}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
          >
            <option value="">Seleccionar entrenador</option>
            {initialTrainers.map(trainer => (
              <option key={trainer.id} value={trainer.id}>
                {`${trainer.nombre} ${trainer.apellido}`}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="nutritionistId" className="flex items-center text-[#03396c]">
            <Apple className="w-4 h-4 mr-2" /> Nutricionista
          </label>
          <select
            id="nutritionistId"
            name="nutritionistId"
            value={formData.nutritionistId}
            onChange={handleChange}
            required
            className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
          >
            <option value="">Seleccionar nutricionista</option>
            {initialNutritionists.map(nutritionist => (
              <option key={nutritionist.id} value={nutritionist.id}>
                {`${nutritionist.nombre} ${nutritionist.apellido}`}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-[#b2d3a7] text-[#03396c] rounded hover:bg-[#65c6c4]">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-[#03396c] text-white rounded hover:bg-[#65c6c4]">
          {initialData ? 'Actualizar Cliente' : 'Crear Cliente'}
        </button>
      </div>
    </form>
  )
}