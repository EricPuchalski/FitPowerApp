"use client";

import { useState, useEffect } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  User,
  Mail,
  Phone,
  MapPin,
  Target,
  Building,
  CheckCircle,
  XCircle,
  Apple,
  Dumbbell,
  Home,
  Users,
} from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { Trainer } from "../../model/Trainer";
import { FooterPag } from "../../components/Footer";
import { useNavigate } from "react-router-dom";

export default function TrainerCrud() {
  const token = localStorage.getItem("token") || "";
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [gyms, setGyms] = useState<{ id: number; name: string }[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTrainer, setEditingTrainer] = useState<Trainer | null>(null);
  const [showInactive, setShowInactive] = useState(false); // Nuevo estado para el checkbox
  const [formData, setFormData] = useState<Omit<Trainer, "id">>({
    name: "",
    lastName: "",
    dni: "",
    phoneNumber: "",
    address: "",
    email: "",
    specialization: "",
    gymName: "",
    active: true,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const api = axios.create({
    baseURL: "http://localhost:8080/api/v1",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  useEffect(() => {
    if (token) {
      fetchInitialData();
    }
  }, [token]);

  // Nuevo useEffect para recargar datos cuando cambie el estado del checkbox
  useEffect(() => {
    if (token) {
      fetchTrainers();
    }
  }, [showInactive, token]);

  const fetchInitialData = async () => {
    try {
      setIsLoading(true);
      const [trainersResponse, gymsResponse] = await Promise.all([
        api.get(`/trainers/all?includeInactive=${showInactive}`), // Actualizado endpoint
        api.get("/gyms"),
      ]);
      setTrainers(trainersResponse.data);
      setGyms(gymsResponse.data);
    } catch (error) {
      toast.error("Error al cargar los datos");
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Nueva función específica para obtener entrenadores
  const fetchTrainers = async () => {
    try {
      const trainersResponse = await api.get(`/trainers/all?includeInactive=${showInactive}`);
      setTrainers(trainersResponse.data);
    } catch (error) {
      toast.error("Error al cargar los entrenadores");
      console.error("Error fetching trainers:", error);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) {
      newErrors.name = "Nombre es requerido";
    } else if (formData.name.length > 50) {
      newErrors.name = "Nombre debe tener menos de 50 caracteres";
    }

    if (!formData.lastName?.trim()) {
      newErrors.lastName = "Apellido es requerido";
    } else if (formData.lastName.length > 50) {
      newErrors.lastName = "Apellido debe tener menos de 50 caracteres";
    }

    if (!formData.dni?.trim()) {
      newErrors.dni = "DNI es requerido";
    } else if (!/^[0-9]{7,10}$/.test(formData.dni)) {
      newErrors.dni = "DNI debe ser un número válido con 7 a 10 dígitos";
    }

    if (!formData.email?.trim()) {
      newErrors.email = "Email es requerido";
    } else if (
      !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)
    ) {
      newErrors.email = "Email debe ser válido";
    }

    if (!formData.phoneNumber?.trim()) {
      newErrors.phoneNumber = "Teléfono es requerido";
    }

    if (!formData.address?.trim()) {
      newErrors.address = "Dirección es requerida";
    } else if (formData.address.length > 200) {
      newErrors.address = "Dirección debe tener menos de 200 caracteres";
    }

    if (!formData.specialization?.trim()) {
      newErrors.specialization = "Especialización es requerida";
    } else if (formData.specialization.length > 100) {
      newErrors.specialization =
        "Especialización debe tener menos de 100 caracteres";
    }

    if (!formData.gymName?.trim()) {
      newErrors.gymName = "Gimnasio es requerido";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (!validateForm()) {
      toast.error("Por favor corrige los errores en el formulario");
      setIsSubmitting(false);
      return;
    }

    try {
      if (editingTrainer) {
        await api.put(`/trainers/${editingTrainer.id}`, formData);
        toast.success("Entrenador actualizado exitosamente!");
      } else {
        // Primero crear la cuenta de usuario
        const signupData = {
          username: formData.dni,
          email: formData.email,
          password: formData.dni,
          role: ["trainer"],
          dni: formData.dni,
          gymName: formData.gymName,
        };

        await api.post("/auth/signup", signupData);

        // Luego crear el entrenador
        await api.post("/trainers", formData);

        toast.success("Entrenador y cuenta creados exitosamente!");
      }

      closeDialog();
      fetchTrainers(); // Actualizado para usar la nueva función
    } catch (error: any) {
      console.error("Error:", error);
      toast.error(error.response?.data?.message || "Error al procesar la solicitud");
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleTrainerStatus = async (
    trainerId: number,
    currentStatus: boolean
  ) => {
    const action = currentStatus ? "inhabilitar" : "habilitar";
    const confirmAction = window.confirm(
      `¿Estás seguro de que deseas ${action} este entrenador?`
    );

    if (confirmAction) {
      try {
        await api.patch(`/trainers/${trainerId}/status`, {
          active: !currentStatus,
        });
        toast.success(`Entrenador ${action}do correctamente`);
        fetchTrainers(); // Actualizado para usar la nueva función
      } catch (error) {
        toast.error(`Error al ${action} el entrenador`);
        console.error(`Error ${action} trainer:`, error);
      }
    }
  };

  const openCreateDialog = () => {
    setEditingTrainer(null);
    setFormData({
      name: "",
      lastName: "",
      dni: "",
      phoneNumber: "",
      address: "",
      email: "",
      specialization: "",
      gymName: "",
      active: true,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const openEditDialog = (trainer: Trainer) => {
    setEditingTrainer(trainer);
    setFormData({
      name: trainer.name || "",
      lastName: trainer.lastName || "",
      dni: trainer.dni || "",
      phoneNumber: trainer.phoneNumber || "",
      address: trainer.address || "",
      email: trainer.email || "",
      specialization: trainer.specialization || "",
      gymName: trainer.gymName || "",
      active: trainer.active,
    });
    setErrors({});
    setIsDialogOpen(true);
  };

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingTrainer(null);
    setFormData({
      name: "",
      lastName: "",
      dni: "",
      phoneNumber: "",
      address: "",
      email: "",
      specialization: "",
      gymName: "",
      active: true,
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
            <a
              href="/admin"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <Home size={18} />
              <span>Inicio</span>
            </a>
            <a
              href="/admin/nutritionists"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <Apple size={18} />
              <span>Nutricionistas</span>
            </a>
            <a
              href="/admin/clients"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a
              href="/admin/trainers"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
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
              <User className="mr-2" /> Gestión de Entrenadores FITPOWER
            </h2>
          </div>
          <div className="pt-6 bg-[#f2e6b6] p-4">
            <div className="flex justify-between items-center">
              <button
                onClick={openCreateDialog}
                className="bg-[#b2d3a7] hover:bg-[#65c6c4] text-[#03396c] px-4 py-2 rounded flex items-center"
              >
                <Plus className="mr-2 h-4 w-4" /> Nuevo Entrenador
              </button>
              
              {/* Nuevo checkbox para mostrar entrenadores inactivos */}
              <div className="flex items-center space-x-2">
                <label className="flex items-center cursor-pointer text-[#03396c]">
                  <input
                    type="checkbox"
                    checked={showInactive}
                    onChange={(e) => setShowInactive(e.target.checked)}
                    className="w-4 h-4 text-[#03396c] bg-[#f2e6b6] border-[#65c6c4] rounded focus:ring-[#65c6c4] focus:ring-2"
                  />
                  <span className="ml-2 font-medium">Mostrar entrenadores inhabilitados</span>
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="border border-[#65c6c4] rounded-lg overflow-hidden">
          <div className="bg-[#f2e6b6] p-4">
            {isLoading ? (
              <div className="text-center py-4">Cargando entrenadores...</div>
            ) : trainers.length === 0 ? (
              <div className="text-center py-4">
                {showInactive ? 'No hay entrenadores registrados' : 'No hay entrenadores activos registrados'}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="bg-[#65c6c4]">
                      <th className="font-bold text-[#03396c] p-2">Nombre</th>
                      <th className="font-bold text-[#03396c] p-2">DNI</th>
                      <th className="font-bold text-[#03396c] p-2">Email</th>
                      <th className="font-bold text-[#03396c] p-2">Especialización</th>
                      <th className="font-bold text-[#03396c] p-2">Estado</th>
                      <th className="font-bold text-[#03396c] p-2">Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {trainers.map((trainer) => (
                      <tr key={trainer.id} className="hover:bg-[#b2d3a7]">
                        <td className="font-medium text-[#03396c] p-2 text-center">
                          {`${trainer.name || ""} ${trainer.lastName || ""}`}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          {trainer.dni || ""}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          {trainer.email || ""}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          {trainer.specialization || ""}
                        </td>
                        <td className="text-[#03396c] p-2 text-center">
                          <div
                            className={`flex items-center justify-center ${
                              trainer.active
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {trainer.active ? (
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
                              onClick={() => openEditDialog(trainer)}
                              className="text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded"
                            >
                              <Pencil className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() =>
                                toggleTrainerStatus(
                                  trainer.id,
                                  trainer.active
                                )
                              }
                              className={`${
                                trainer.active
                                  ? "text-[#f8c471] hover:bg-[#f8c471]"
                                  : "text-[#b2d3a7] hover:bg-[#b2d3a7]"
                              } hover:text-[#f2e6b6] p-1 rounded`}
                            >
                              {trainer.active ? (
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
                {editingTrainer ? "Editar" : "Crear"} Entrenador
              </h3>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="name"
                      className="flex items-center text-[#03396c]"
                    >
                      <User className="w-4 h-4 mr-2" /> Nombre*
                    </label>
                    <input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.name ? "border-red-500" : "border-[#65c6c4]"
                      } text-[#03396c] rounded`}
                    />
                    {errors.name && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.name}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="lastName"
                      className="flex items-center text-[#03396c]"
                    >
                      <User className="w-4 h-4 mr-2" /> Apellido*
                    </label>
                    <input
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={(e) =>
                        setFormData({ ...formData, lastName: e.target.value })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.lastName
                          ? "border-red-500"
                          : "border-[#65c6c4]"
                      } text-[#03396c] rounded`}
                    />
                    {errors.lastName && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.lastName}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="dni"
                      className="flex items-center text-[#03396c]"
                    >
                      <User className="w-4 h-4 mr-2" /> DNI*
                    </label>
                    <input
                      id="dni"
                      name="dni"
                      value={formData.dni}
                      onChange={(e) =>
                        setFormData({ ...formData, dni: e.target.value })
                      }
                      disabled={editingTrainer !== null}
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.dni ? "border-red-500" : "border-[#65c6c4]"
                      } text-[#03396c] rounded ${
                        editingTrainer ? "opacity-50 cursor-not-allowed" : ""
                      }`}
                    />
                    {errors.dni && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.dni}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="email"
                      className="flex items-center text-[#03396c]"
                    >
                      <Mail className="w-4 h-4 mr-2" /> Email*
                    </label>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.email ? "border-red-500" : "border-[#65c6c4]"
                      } text-[#03396c] rounded`}
                    />
                    {errors.email && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="phoneNumber"
                      className="flex items-center text-[#03396c]"
                    >
                      <Phone className="w-4 h-4 mr-2" /> Teléfono*
                    </label>
                    <input
                      id="phoneNumber"
                      name="phoneNumber"
                      value={formData.phoneNumber}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          phoneNumber: e.target.value,
                        })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.phoneNumber
                          ? "border-red-500"
                          : "border-[#65c6c4]"
                      } text-[#03396c] rounded`}
                    />
                    {errors.phoneNumber && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>
                  <div>
                    <label
                      htmlFor="address"
                      className="flex items-center text-[#03396c]"
                    >
                      <MapPin className="w-4 h-4 mr-2" /> Dirección*
                    </label>
                    <input
                      id="address"
                      name="address"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.address ? "border-red-500" : "border-[#65c6c4]"
                      } text-[#03396c] rounded`}
                    />
                    {errors.address && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.address}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="specialization"
                      className="flex items-center text-[#03396c]"
                    >
                      <Target className="w-4 h-4 mr-2" /> Especialización*
                    </label>
                    <input
                      id="specialization"
                      name="specialization"
                      value={formData.specialization || ""}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          specialization: e.target.value,
                        })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.specialization
                          ? "border-red-500"
                          : "border-[#65c6c4]"
                      } text-[#03396c] rounded`}
                    />
                    {errors.specialization && (
                      <p className="mt-1 text-sm text-red-600">
                        {errors.specialization}
                      </p>
                    )}
                  </div>
                  <div className="col-span-2">
                    <label
                      htmlFor="gymName"
                      className="flex items-center text-[#03396c]"
                    >
                      <Building className="w-4 h-4 mr-2" /> Gimnasio*
                    </label>
                    <select
                      id="gymName"
                      name="gymName"
                      value={formData.gymName}
                      onChange={(e) =>
                        setFormData({ ...formData, gymName: e.target.value })
                      }
                      className={`mt-1 w-full p-2 bg-[#f2e6b6] border ${
                        errors.gymName ? "border-red-500" : "border-[#65c6c4]"
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
                      <p className="mt-1 text-sm text-red-600">
                        {errors.gymName}
                      </p>
                    )}
                  </div>
                  {editingTrainer && (
                    <div className="col-span-2">
                      <label className="flex items-center text-[#03396c] mb-2">
                        Estado del Entrenador
                      </label>
                      <div className="flex space-x-4">
                        <label className="flex items-center">
                          <input
                            type="radio"
                            className="form-radio h-4 w-4 text-green-600"
                            name="active"
                            checked={formData.active}
                            onChange={() =>
                              setFormData({ ...formData, active: true })
                            }
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
                            onChange={() =>
                              setFormData({ ...formData, active: false })
                            }
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
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                  >
                    {isSubmitting
                      ? "Procesando..."
                      : editingTrainer
                      ? "Actualizar"
                      : "Crear"}{" "}
                    Entrenador
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