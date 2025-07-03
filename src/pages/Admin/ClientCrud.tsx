"use client";

import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, User, Mail, Phone, MapPin, Target, Building, CheckCircle, XCircle, Dumbbell, Apple, Users, Home } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { Client } from "../../model/Client";
import { FooterPag } from "../../components/Footer";
import { useNavigate } from "react-router-dom";

export default function ClientCrud() {
  const token = localStorage.getItem("token") || "";
  const [clients, setClients] = useState<Client[]>([]);
  const [gyms, setGyms] = useState<{id: number, name: string}[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [showInactive, setShowInactive] = useState(false); // Nuevo estado para el checkbox
  const [formData, setFormData] = useState<Omit<Client, 'id'>>({
    name: "",
    lastName: "",
    dni: "",
    phoneNumber: "",
    address: "",
    email: "",
    goal: "",
    initialPhysicalCondition: "",
    gymName: "",
    active: true
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/v1',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  });

  useEffect(() => {
    if (token) {
      fetchInitialData();
    }
  }, [token]);

  // Nuevo useEffect para recargar datos cuando cambie el estado del checkbox
  useEffect(() => {
    if (token) {
      fetchClients();
    }
  }, [showInactive, token]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [clientsResponse, gymsResponse] = await Promise.all([
        api.get(`/clients/all?includeInactive=${showInactive}`), // Actualizado endpoint
        api.get('/gyms')
      ]);
      setClients(clientsResponse.data);
      setGyms(gymsResponse.data);
    } catch (error) {
      toast.error('Error al cargar los datos');
      console.error('Error fetching data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función específica para obtener clientes
  const fetchClients = async () => {
    try {
      const clientsResponse = await api.get(`/clients/all?includeInactive=${showInactive}`);
      setClients(clientsResponse.data);
    } catch (error) {
      toast.error('Error al cargar los clientes');
      console.error('Error fetching clients:', error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = 'Nombre es requerido';
    } else if (formData.name.length > 50) {
      newErrors.name = 'Nombre debe tener menos de 50 caracteres';
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = 'Apellido es requerido';
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = 'Apellido debe tener menos de 50 caracteres';
    }

    if (!formData.dni?.trim()) {
      newErrors.dni = 'DNI es requerido';
    } else if (!/^[0-9]{7,10}$/.test(formData.dni)) {
      newErrors.dni = 'DNI debe ser un número válido con 7 a 10 dígitos';
    }

    if (!formData.email?.trim()) {
      newErrors.email = 'Email es requerido';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email debe ser válido';
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = 'Teléfono es requerido';
    }

    if (!formData.address?.trim()) {
      newErrors.address = 'Dirección es requerida';
    } else if (formData.address.length > 200) {
      newErrors.address = 'Dirección debe tener menos de 200 caracteres';
    }

    if (!formData.goal?.trim()) {
      newErrors.goal = 'Objetivo es requerido';
    } else if (formData.goal.length > 200) {
      newErrors.goal = 'Objetivo debe tener menos de 200 caracteres';
    }

    if (!formData.initialPhysicalCondition?.trim()) {
      newErrors.initialPhysicalCondition = 'Condición física inicial es requerida';
    } else if (formData.initialPhysicalCondition.length > 100) {
      newErrors.initialPhysicalCondition = 'Condición física inicial debe tener menos de 100 caracteres';
    }

    if (!formData.gymName?.trim()) {
      newErrors.gymName = 'Gimnasio es requerido';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    if (!validateForm()) {
      toast.error('Por favor corrige los errores en el formulario');
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingClient) {
        await api.put(`/clients/${editingClient.id}`, formData);
        toast.success('Cliente actualizado exitosamente!');
      } else {
        const clientResponse = await api.post('/clients', formData);
        
        if (clientResponse.data.id) {
          const signupData = {
            username: formData.dni,
            email: formData.email,
            password: formData.dni,
            role: ['client'],
            dni: formData.dni,
            gymName: formData.gymName
          };
          
          await api.post('/auth/signup', signupData);
          toast.success('Cliente y cuenta creados exitosamente!');
        }
      }
      
      closeDialog();
      fetchClients(); // Actualizado para usar la nueva función
    } catch (error: any) {
      console.error('Error:', error);
      toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleClientStatus = async (clientId: number, currentStatus: boolean) => {
    const action = currentStatus ? 'inhabilitar' : 'habilitar';
    const confirmAction = window.confirm(`¿Estás seguro de que deseas ${action} este cliente?`);
    
    if (confirmAction) {
      try {
        await api.patch(`/clients/${clientId}/status`, { active: !currentStatus });
        toast.success(`Cliente ${action}do correctamente`);
        fetchClients(); // Actualizado para usar la nueva función
      } catch (error) {
        toast.error(`Error al ${action} el cliente`);
        console.error(`Error ${action} client:`, error);
      }
    }
  };

  const openCreateDialog = () => {
    setEditingClient(null);
    setFormData({
      name: "",
      lastName: "",
      dni: "",
      phoneNumber: "",
      address: "",
      email: "",
      goal: "",
      initialPhysicalCondition: "",
      gymName: "",
      active: true
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (client: Client) => {
    setEditingClient(client);
    setFormData({
      name: client.name || "",
      lastName: client.lastName || "",
      dni: client.dni || "",
      phoneNumber: client.phoneNumber || "",
      address: client.address || "",
      email: client.email || "",
      goal: client.goal || "",
      initialPhysicalCondition: client.initialPhysicalCondition || "",
      gymName: client.gymName || "",
      active: client.active
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingClient(null);
    setFormData({
      name: "",
      lastName: "",
      dni: "",
      phoneNumber: "",
      address: "",
      email: "",
      goal: "",
      initialPhysicalCondition: "",
      gymName: "",
      active: true
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen bg-[url('https://img.freepik.com/free-photo/3d-gym-equipment_23-2151114137.jpg')] bg-cover bg-center bg-no-repeat">
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Admin</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="/admin" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Home size={18} />
              <span>Inicio</span>
            </a>
            <a href="/admin/nutritionists" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Apple size={18} />
              <span>Nutricionistas</span>
            </a>
            <a href="/admin/clients" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="/admin/trainers" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Dumbbell size={18} />
              <span>Entrenadores</span>
            </a>
          </nav>
        </div>
      </header>

      <ToastContainer position="top-right" autoClose={5000} />

      <div className="container mx-auto px-4 py-8 bg-[#03396c]/90 min-h-screen">
        <div className="mb-8 border border-[#65c6c4] rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-[#03396c] to-[#65c6c4] p-4">
            <h2 className="text-2xl font-bold text-white flex items-center">
              <User className="mr-2" /> Gestión de Clientes FITPOWER
            </h2>
          </div>
          <div className="pt-6 bg-[#f2e6b6] p-4">
            <div className="flex justify-between items-center">
              <button
                onClick={openCreateDialog}
                className="bg-[#b2d3a7] hover:bg-[#65c6c4] text-[#03396c] px-4 py-2 rounded flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" /> Nuevo Cliente
              </button>
              
              {/* Nuevo checkbox para mostrar clientes inactivos */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer text-[#03396c]">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="w-4 h-4 text-[#03396c] bg-[#f2e6b6] border-[#65c6c4] rounded focus:ring-[#65c6c4] focus:ring-2"
                  />
                  <span className="ml-2 font-medium">Mostrar clientes inhabilitados</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[#65c6c4] rounded-lg overflow-hidden">
          <div className="bg-[#f2e6b6] p-4">
            {isLoading ? (
              <div className="text-center py-4">Cargando clientes...</div>
            ) : clients.length === 0 ? (
              <div className="text-center py-4">
                {showInactive ? 'No hay clientes registrados' : 'No hay clientes activos registrados'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#65c6c4]">
                      <th className="font-bold text-[#03396c] p-2">Nombre</th>
                      <th className="font-bold text-[#03396c] p-2">DNI</th>
                      <th className="font-bold text-[#03396c] p-2">Email</th>
                      <th className="font-bold text-[#03396c] p-2">Teléfono</th>
                      <th className="font-bold text-[#03396c] p-2">Estado</th>
                      <th className="font-bold text-[#03396c] p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clients.map((client) => (
                      <tr key={client.id} className="hover:bg-[#b2d3a7]">
                        <td className="font-medium text-[#03396c] p-2 text-center">
                          {`${client.name || ''} ${client.lastName || ''}`}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          {client.dni || ''}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          {client.email || ''}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          {client.phoneNumber || ''}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          <div className={`flex items-center justify-center ${client.active ? 'text-green-600' : 'text-red-600'}`}>
                            {client.active ? (
                              <>
                                <CheckCircle className="h-5 w-5 mr-1" />
                                <span>Activo</span>
                              </>
                            ) : (
                              <>
                                <XCircle className="h-5 w-5 mr-1" />
                                <span>Inactivo</span>
                              </>
                            )}
                          </div>
                        </td>
                        <td className="p-2">
                          <div className="flex space-x-2 justify-center">
                            <button
                              onClick={() => openEditDialog(client)}
                              className="text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleClientStatus(client.id, client.active)}
                              className={`${client.active ? 'text-[#f8c471] hover:bg-[#f8c471]' : 'text-[#b2d3a7] hover:bg-[#b2d3a7]'} hover:text-[#f2e6b6] p-1 rounded`}
                            >
                              {client.active ? (
                                <Trash2 className="h-4 w-4" />
                              ) : (
                                <CheckCircle className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {isDialogOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto">
              <h3 className="text-2xl font-bold text-[#03396c] mb-4">
                {editingClient ? 'Editar' : 'Crear'} Cliente
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="flex items-center text-[#03396c]">
                      <User className="w-4 h-4 mr-2" /> Nombre*
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.name ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="flex items-center text-[#03396c]">
                      <User className="w-4 h-4 mr-2" /> Apellido*
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.lastName ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">{errors.lastName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="dni" className="flex items-center text-[#03396c]">
                      <User className="w-4 h-4 mr-2" /> DNI*
                    </label>
                    <input
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={(e) => setFormData({...formData, dni: e.target.value})}
                      disabled={editingClient !== null}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.dni ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded ${editingClient ? 'opacity-50 cursor-not-allowed' : ''}`}
                    />
                    {errors.dni && (
                      <p className="mt-1 text-sm text-red-600">{errors.dni}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="email" className="flex items-center text-[#03396c]">
                      <Mail className="w-4 h-4 mr-2" /> Email*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.email ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="phoneNumber" className="flex items-center text-[#03396c]">
                      <Phone className="w-4 h-4 mr-2" /> Teléfono*
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.phoneNumber ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">{errors.phoneNumber}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="address" className="flex items-center text-[#03396c]">
                      <MapPin className="w-4 h-4 mr-2" /> Dirección*
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={(e) => setFormData({...formData, address: e.target.value})}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.address ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">{errors.address}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="goal" className="flex items-center text-[#03396c]">
                      <Target className="w-4 h-4 mr-2" /> Objetivo*
                    </label>
                    <textarea
                      id="goal"
                      name="goal"
                      value={formData.goal || ""}
                      onChange={(e) => setFormData({...formData, goal: e.target.value})}
                      rows={3}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.goal ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.goal && (
                      <p className="mt-1 text-sm text-red-600">{errors.goal}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="initialPhysicalCondition" className="flex items-center text-[#03396c]">
                      <Target className="w-4 h-4 mr-2" /> Condición Física Inicial*
                    </label>
                    <textarea
                      id="initialPhysicalCondition"
                      name="initialPhysicalCondition"
                      value={formData.initialPhysicalCondition || ""}
                      onChange={(e) => setFormData({...formData, initialPhysicalCondition: e.target.value})}
                      rows={3}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.initialPhysicalCondition ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    />
                    {errors.initialPhysicalCondition && (
                      <p className="mt-1 text-sm text-red-600">{errors.initialPhysicalCondition}</p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label htmlFor="gymName" className="flex items-center text-[#03396c]">
                      <Building className="w-4 h-4 mr-2" /> Gimnasio*
                    </label>
                    <select
                      id="gymName"
                      name="gymName"
                      value={formData.gymName}
                      onChange={(e) => setFormData({...formData, gymName: e.target.value})}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.gymName ? 'border-red-500' : 'border-[#65c6c4]'
                      } text-[#03396c] rounded`}
                    >
                      <option value="">Selecciona un gimnasio</option>
                      {gyms.map((gym) => (
                        <option key={gym.id} value={gym.name}>
                          {gym.name}
                        </option>
                      ))}
                    </select>
                    {errors.gymName && (
                      <p className="mt-1 text-sm text-red-600">{errors.gymName}</p>
                    )}
                  </div>
                  {editingClient && (
                    <div className="col-span-2">
                      <label className="flex items-center text-[#03396c] mb-2">
                        Estado del Cliente
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-green-600"
                            name="active"
                            checked={formData.active}
                            onChange={() => setFormData({...formData, active: true})}
                          />
                          <span className="ml-2 flex items-center">
                            <CheckCircle className="h-5 w-5 text-green-600 mr-1" />
                            Activo
                          </span>
                        </label>
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-red-600"
                            name="active"
                            checked={!formData.active}
                            onChange={() => setFormData({...formData, active: false})}
                          />
                          <span className="ml-2 flex items-center">
                            <XCircle className="h-5 w-5 text-red-600 mr-1" />
                            Inactivo
                          </span>
                        </label>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={closeDialog}
                    className="bg-[#e74c3c] text-white px-4 py-2 rounded mr-2"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`bg-[#2ecc71] text-white px-4 py-2 rounded ${
                      isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? 'Procesando...' : editingClient ? 'Actualizar' : 'Crear'} Cliente
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
      <FooterPag></FooterPag>
    </div>
  );
}