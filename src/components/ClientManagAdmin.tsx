"use client"

import { useState } from 'react'
import { Plus, Pencil, Trash2, User, Dumbbell, Apple, Mail, Phone, MapPin, Target, Activity, Building } from 'lucide-react'
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "../../components/ui/dialog"
import { Label } from "../../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card"
import { FooterPag } from './Footer'

type Client = {
  id: string
  nombre: string
  apellido: string
  dni: string
  email: string
  telefono: string
  direccion: string
  objetivos: string
  estadoFisicoInicial: string
  gimnasioAsignado: string
  nutricionista: string
  entrenador: string
}

const initialClients: Client[] = [
  {
    id: '1',
    nombre: 'Juan',
    apellido: 'Pérez',
    dni: '12345678A',
    email: 'juan@example.com',
    telefono: '123456789',
    direccion: 'Calle Principal 123',
    objetivos: 'Perder peso',
    estadoFisicoInicial: 'Sedentario',
    gimnasioAsignado: 'GymPower Central',
    nutricionista: 'Ana Nutricionista',
    entrenador: 'Carlos Entrenador'
  },
  {
    id: '2',
    nombre: 'María',
    apellido: 'González',
    dni: '87654321B',
    email: 'maria@example.com',
    telefono: '987654321',
    direccion: 'Avenida Secundaria 456',
    objetivos: 'Ganar masa muscular',
    estadoFisicoInicial: 'Activo',
    gimnasioAsignado: 'GymPower Norte',
    nutricionista: 'Pedro Nutricionista',
    entrenador: 'Laura Entrenadora'
  },
]

export default function ClientManagement() {
  const [clients, setClients] = useState<Client[]>(initialClients)
  const [isNewClientDialogOpen, setIsNewClientDialogOpen] = useState(false)
  const [editingClient, setEditingClient] = useState<Client | null>(null)

  const handleCreateClient = (newClient: Omit<Client, 'id'>) => {
    const clientWithId = { ...newClient, id: Date.now().toString() }
    setClients([...clients, clientWithId])
    setIsNewClientDialogOpen(false)
  }

  const handleEditClient = (updatedClient: Client) => {
    setClients(clients.map(client => client.id === updatedClient.id ? updatedClient : client))
    setEditingClient(null)
  }

  const handleDeleteClient = (id: string) => {
    setClients(clients.filter(client => client.id !== id))
  }

  return (
    
    <div className="container mx-auto px-4 py-8">
      <Card className="mb-8">
        <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-600">
          <CardTitle className="text-2xl font-bold text-white flex items-center">
            <User className="mr-2" /> Gestión de Clientes
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <Dialog open={isNewClientDialogOpen} onOpenChange={setIsNewClientDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-green-500 hover:bg-green-600 text-white">
                <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
              </Button>
            </DialogTrigger>
            <DialogContent 
              className="max-w-xl bg-white shadow-lg border border-gray-200 max-h-[100%] overflow-y-auto"
            >
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-gray-800">Crear Nuevo Cliente</DialogTitle>
              </DialogHeader>
              <ClientForm onSubmit={handleCreateClient} />
            </DialogContent>

          </Dialog>
        </CardContent>
      </Card>

      <Card>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead className="font-bold">Nombre</TableHead>
                <TableHead className="font-bold">Email</TableHead>
                <TableHead className="font-bold">Teléfono</TableHead>
                <TableHead className="font-bold">Gimnasio</TableHead>
                <TableHead className="font-bold">Nutricionista</TableHead>
                <TableHead className="font-bold">Entrenador</TableHead>
                <TableHead className="font-bold">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clients.map((client) => (
                <TableRow key={client.id} className="hover:bg-gray-50">
                  <TableCell className="font-medium">{`${client.nombre} ${client.apellido}`}</TableCell>
                  <TableCell>{client.email}</TableCell>
                  <TableCell>{client.telefono}</TableCell>
                  <TableCell>{client.gimnasioAsignado}</TableCell>
                  <TableCell>{client.nutricionista}</TableCell>
                  <TableCell>{client.entrenador}</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button variant="outline" size="icon" className="text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={() => setEditingClient(client)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-md bg-white shadow-lg border border-gray-200">
                          <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-gray-800">Editar Cliente</DialogTitle>
                          </DialogHeader>
                          {/* {editingClient && (
                            <ClientForm onSubmit={handleEditClient} initialData={editingClient} />
                          )} */}
                        </DialogContent>
                      </Dialog>
                      <Button variant="outline" size="icon" className="text-red-600 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeleteClient(client.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

type ClientFormProps = {
  onSubmit: (client: Omit<Client, 'id'>) => void
  initialData?: Client
}

function ClientForm({ onSubmit, initialData }: ClientFormProps) {
  const [formData, setFormData] = useState<Omit<Client, 'id'>>(
    initialData || {
      nombre: '',
      apellido: '',
      dni: '',
      email: '',
      telefono: '',
      direccion: '',
      objetivos: '',
      estadoFisicoInicial: '',
      gimnasioAsignado: '',
      nutricionista: '',
      entrenador: ''
    }
  )

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSubmit(formData)
  }

  return (
<>
<form onSubmit={handleSubmit} className="space-y-4">
<div className="grid grid-cols-2 gap-4">
  <div>
    <Label htmlFor="nombre" className="flex items-center text-gray-700">
      <User className="w-4 h-4 mr-2" /> Nombre
    </Label>
    <Input id="nombre" name="nombre" value={formData.nombre} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="apellido" className="flex items-center text-gray-700">
      <User className="w-4 h-4 mr-2" /> Apellido
    </Label>
    <Input id="apellido" name="apellido" value={formData.apellido} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="dni" className="flex items-center text-gray-700">
      <User className="w-4 h-4 mr-2" /> DNI
    </Label>
    <Input id="dni" name="dni" value={formData.dni} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="email" className="flex items-center text-gray-700">
      <Mail className="w-4 h-4 mr-2" /> Email
    </Label>
    <Input id="email" name="email" type="email" value={formData.email} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="telefono" className="flex items-center text-gray-700">
      <Phone className="w-4 h-4 mr-2" /> Teléfono
    </Label>
    <Input id="telefono" name="telefono" value={formData.telefono} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="direccion" className="flex items-center text-gray-700">
      <MapPin className="w-4 h-4 mr-2" /> Dirección
    </Label>
    <Input id="direccion" name="direccion" value={formData.direccion} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="objetivos" className="flex items-center text-gray-700">
      <Target className="w-4 h-4 mr-2" /> Objetivos
    </Label>
    <Input id="objetivos" name="objetivos" value={formData.objetivos} onChange={handleChange} required className="mt-1" />
  </div>
  <div>
    <Label htmlFor="estadoFisicoInicial" className="flex items-center text-gray-700">
      <Activity className="w-4 h-4 mr-2" /> Estado Físico Inicial
    </Label>
    <Input id="estadoFisicoInicial" name="estadoFisicoInicial" value={formData.estadoFisicoInicial} onChange={handleChange} required className="mt-1" />
  </div>

  {/* Alinea los selectores de gimnasio, nutricionista y entrenador en la misma fila */}
  <div className="col-span-2 grid grid-cols-3 gap-4">
    <div>
      <Label htmlFor="gimnasioAsignado" className="flex items-center text-gray-700">
        <Building className="w-4 h-4 mr-2" /> Gimnasio Asignado
      </Label>
      <Select
        name="gimnasioAsignado"
        value={formData.gimnasioAsignado}
        onValueChange={(value) => handleChange({ target: { name: 'gimnasioAsignado', value } } as any)}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Seleccionar gimnasio" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="GymPower Central">GymPower Central</SelectItem>
          <SelectItem value="GymPower Norte">GymPower Norte</SelectItem>
          <SelectItem value="GymPower Sur">GymPower Sur</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="nutricionista" className="flex items-center text-gray-700">
        <Apple className="w-4 h-4 mr-2" /> Nutricionista
      </Label>
      <Select
        name="nutricionista"
        value={formData.nutricionista}
        onValueChange={(value) => handleChange({ target: { name: 'nutricionista', value } } as any)}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Seleccionar nutricionista" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Ana Nutricionista">Ana Nutricionista</SelectItem>
          <SelectItem value="Pedro Nutricionista">Pedro Nutricionista</SelectItem>
          <SelectItem value="María Nutricionista">María Nutricionista</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div>
      <Label htmlFor="entrenador" className="flex items-center text-gray-700">
        <Dumbbell className="w-4 h-4 mr-2" /> Entrenador
      </Label>
      <Select
        name="entrenador"
        value={formData.entrenador}
        onValueChange={(value) => handleChange({ target: { name: 'entrenador', value } } as any)}
      >
        <SelectTrigger className="mt-1">
          <SelectValue placeholder="Seleccionar entrenador" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="Carlos Entrenador">Carlos Entrenador</SelectItem>
          <SelectItem value="Laura Entrenadora">Laura Entrenadora</SelectItem>
        </SelectContent>
      </Select>
    </div>
  </div>
</div>  
</form>
<FooterPag></FooterPag>
</>
  )
}