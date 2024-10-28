"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, User, Dumbbell, Mail, Phone, MapPin, Briefcase, Award, Building, Users, Calendar } from 'lucide-react'

type Trainer = {
  id: string
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string
  direccion: string
  especialidad: string
  experiencia: string
  gimnasioAsignado: string
  certificaciones: string
  clientesAsignados: number
}

const initialTrainers: Trainer[] = [
  {
    id: '1',
    nombre: 'Carlos',
    apellido: 'Entrenador',
    dni: '11223344A',
    email: 'carlos@fitpower.com',
    telefono: '123456789',
    direccion: 'Calle Fitness 123',
    especialidad: 'Entrenamiento de fuerza',
    experiencia: '5 años',
    gimnasioAsignado: 'FITPOWER Central',
    certificaciones: 'NSCA-CPT',
    clientesAsignados: 15
  },
  {
    id: '2',
    nombre: 'Laura',
    apellido: 'Entrenadora',
    dni: '55667788B',
    email: 'laura@fitpower.com',
    telefono: '987654321',
    direccion: 'Avenida Salud 456',
    especialidad: 'Yoga y Pilates',
    experiencia: '7 años',
    gimnasioAsignado: 'FITPOWER Norte',
    certificaciones: 'ACE-CPT, RYT-200',
    clientesAsignados: 20
  },
]

export default function TrainerManagement() {
  const [trainers, setTrainers] = useState<Trainer[]>(initialTrainers)
  const [isNewTrainerDialogOpen, setIsNewTrainerDialogOpen] = useState(false)
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null)

  const handleCreateTrainer = (newTrainer: Omit<Trainer, 'id'>) => {
    const trainerWithId = { ...newTrainer, id: Date.now().toString(), clientesAsignados: 0 }
    setTrainers([...trainers, trainerWithId])
    setIsNewTrainerDialogOpen(false)
  }

  const handleEditTrainer = (updatedTrainer: Trainer) => {
    setTrainers(trainers.map(trainer => trainer.id === updatedTrainer.id ? updatedTrainer : trainer))
    setEditingTrainer(null)
  }

  const handleDeleteTrainer = (id: string) => {
    setTrainers(trainers.filter(trainer => trainer.id !== id))
  }

  return (
    <div className="min-h-screen bg-[url('https://images4.alphacoders.com/134/1345029.png')] bg-cover bg-center bg-no-repeat">
      <div className="container mx-auto px-4 py-8 bg-[#03396c]/90 min-h-screen">
        <div className="mb-8 border border-[#65c6c4] rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#03396c] to-[#65c6c4] p-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <Dumbbell className="mr-2" /> Gestión de Entrenadores FITPOWER
            </h2>
          </div>
          <div className="pt-6 bg-[#f2e6b6] p-4">
            <button 
              onClick={() => setIsNewTrainerDialogOpen(true)}
              className="bg-[#b2d3a7] hover:bg-[#65c6c4] text-[#03396c] px-4 py-2 rounded flex items-center"
            >
              <Plus className="mr-2 h-4 w-4" /> Nuevo Entrenador
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
                  <th className="font-bold text-[#03396c] p-2">Especialidad</th>
                  <th className="font-bold text-[#03396c] p-2">Gimnasio</th>
                  <th className="font-bold text-[#03396c] p-2">Clientes Asignados</th>
                  <th className="font-bold text-[#03396c] p-2">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {trainers.map((trainer) => (
                  <tr key={trainer.id} className="hover:bg-[#b2d3a7]">
                    <td className="font-medium text-[#03396c] p-2">{`${trainer.nombre} ${trainer.apellido}`}</td>
                    <td className="text-[#03396c] p-2">{trainer.email}</td>
                    <td className="text-[#03396c] p-2">{trainer.telefono}</td>
                    <td className="text-[#03396c] p-2">{trainer.especialidad}</td>
                    <td className="text-[#03396c] p-2">{trainer.gimnasioAsignado}</td>
                    <td className="text-[#03396c] p-2">{trainer.clientesAsignados}</td>
                    <td className="p-2">
                      <div className="flex space-x-2">
                        <button 
                          onClick={() => setEditingTrainer(trainer)}
                          className="text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded"
                        >
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button 
                          onClick={() => handleDeleteTrainer(trainer.id)}
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

      {(isNewTrainerDialogOpen || editingTrainer) && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
            <h3 className="text-2xl font-bold text-[#03396c] mb-4">
              {editingTrainer ? 'Editar Entrenador' : 'Crear Nuevo Entrenador'}
            </h3>
            <TrainerForm 
              onSubmit={editingTrainer ? handleEditTrainer : handleCreateTrainer} 
              initialData={editingTrainer || undefined}
              onClose={() => {
                setIsNewTrainerDialogOpen(false)
                setEditingTrainer(null)
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

type TrainerFormProps = {
  onSubmit: (trainer: Trainer) => void
  initialData?: Trainer
  onClose: () => void
}

function TrainerForm({ onSubmit, initialData, onClose }: TrainerFormProps) {
  const [formData, setFormData] = useState<Trainer>(
    initialData || {
      id: '',
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      direccion: '',
      especialidad: '',
      experiencia: '',
      gimnasioAsignado: '',
      certificaciones: '',
      clientesAsignados: 0
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
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
          <label htmlFor="especialidad" className="flex items-center text-[#03396c]">
            <Briefcase className="w-4 h-4 mr-2" /> Especialidad
          </label>
          <input id="especialidad" name="especialidad" value={formData.especialidad} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="experiencia" className="flex items-center text-[#03396c]">
            <Calendar className="w-4 h-4 mr-2" /> Experiencia
          </label>
          <input id="experiencia" name="experiencia" value={formData.experiencia} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="gimnasioAsignado" className="flex items-center text-[#03396c]">
            <Building className="w-4 h-4 mr-2" /> Gimnasio Asignado
          </label>
          <select
            id="gimnasioAsignado"
            name="gimnasioAsignado"
            value={formData.gimnasioAsignado}
            onChange={handleChange}
            className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded"
          >
            <option value="">Seleccionar gimnasio</option>
            <option value="FITPOWER Central">FITPOWER Central</option>
            <option value="FITPOWER Norte">FITPOWER Norte</option>
            <option value="FITPOWER Sur">FITPOWER Sur</option>
          </select>
        </div>
        <div>
          <label htmlFor="certificaciones" className="flex items-center text-[#03396c]">
            <Award className="w-4 h-4 mr-2" /> Certificaciones
          </label>
          <input id="certificaciones" name="certificaciones" value={formData.certificaciones} onChange={handleChange} required className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
        <div>
          <label htmlFor="clientesAsignados" className="flex items-center text-[#03396c]">
            <Users className="w-4  h-4 mr-2" /> Clientes Asignados
          </label>
          <input id="clientesAsignados" name="clientesAsignados" type="number" value={formData.clientesAsignados} onChange={handleChange} className="mt-1 w-full p-2 bg-[#f2e6b6] border border-[#65c6c4] text-[#03396c] rounded" />
        </div>
      </div>
      <div className="flex justify-end space-x-2">
        <button type="button" onClick={onClose} className="px-4 py-2 bg-[#b2d3a7] text-[#03396c] rounded hover:bg-[#65c6c4]">
          Cancelar
        </button>
        <button type="submit" className="px-4 py-2 bg-[#03396c] text-white rounded hover:bg-[#65c6c4]">
          {initialData ? 'Actualizar Entrenador' : 'Crear Entrenador'}
        </button>
      </div>
    </form>
  )
}