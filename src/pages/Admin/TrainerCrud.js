"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, User, Mail, Phone, MapPin, Target, Building, CheckCircle, XCircle, } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { FooterPag } from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hook/useAuth";
import { AdminHeader } from "../../components/AdminHeader";
export default function TrainerCrud() {
    const token = localStorage.getItem("token") || "";
    const [trainers, setTrainers] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingTrainer, setEditingTrainer] = useState(null);
    const [showInactive, setShowInactive] = useState(false); // Nuevo estado para el checkbox
    const [formData, setFormData] = useState({
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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { logout } = useAuth();
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
        }
        catch (error) {
            toast.error("Error al cargar los datos");
            console.error("Error fetching data:", error);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Nueva función específica para obtener entrenadores
    const fetchTrainers = async () => {
        try {
            const trainersResponse = await api.get(`/trainers/all?includeInactive=${showInactive}`);
            setTrainers(trainersResponse.data);
        }
        catch (error) {
            toast.error("Error al cargar los entrenadores");
            console.error("Error fetching trainers:", error);
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) {
            newErrors.name = "Nombre es requerido";
        }
        else if (formData.name.length > 50) {
            newErrors.name = "Nombre debe tener menos de 50 caracteres";
        }
        if (!formData.lastName?.trim()) {
            newErrors.lastName = "Apellido es requerido";
        }
        else if (formData.lastName.length > 50) {
            newErrors.lastName = "Apellido debe tener menos de 50 caracteres";
        }
        if (!formData.dni?.trim()) {
            newErrors.dni = "DNI es requerido";
        }
        else if (!/^[0-9]{7,10}$/.test(formData.dni)) {
            newErrors.dni = "DNI debe ser un número válido con 7 a 10 dígitos";
        }
        if (!formData.email?.trim()) {
            newErrors.email = "Email es requerido";
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = "Email debe ser válido";
        }
        if (!formData.phoneNumber?.trim()) {
            newErrors.phoneNumber = "Teléfono es requerido";
        }
        if (!formData.address?.trim()) {
            newErrors.address = "Dirección es requerida";
        }
        else if (formData.address.length > 200) {
            newErrors.address = "Dirección debe tener menos de 200 caracteres";
        }
        if (!formData.specialization?.trim()) {
            newErrors.specialization = "Especialización es requerida";
        }
        else if (formData.specialization.length > 100) {
            newErrors.specialization =
                "Especialización debe tener menos de 100 caracteres";
        }
        if (!formData.gymName?.trim()) {
            newErrors.gymName = "Gimnasio es requerido";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
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
            }
            else {
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
        }
        catch (error) {
            console.error("Error:", error);
            toast.error(error.response?.data?.message || "Error al procesar la solicitud");
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const toggleTrainerStatus = async (trainerId, currentStatus) => {
        const action = currentStatus ? "inhabilitar" : "habilitar";
        const confirmAction = window.confirm(`¿Estás seguro de que deseas ${action} este entrenador?`);
        if (confirmAction) {
            try {
                await api.patch(`/trainers/${trainerId}/status`, {
                    active: !currentStatus,
                });
                toast.success(`Entrenador ${action}do correctamente`);
                fetchTrainers(); // Actualizado para usar la nueva función
            }
            catch (error) {
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
    const openEditDialog = (trainer) => {
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
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsxs("div", { className: "min-h-screen bg-[url('https://img.freepik.com/free-photo/3d-gym-equipment_23-2151114137.jpg')] bg-cover bg-center bg-no-repeat", children: [_jsx(AdminHeader, { onLogout: handleLogout }), _jsx(ToastContainer, { position: "top-right", autoClose: 5000 }), _jsxs("div", { className: "container mx-auto px-4 py-8 bg-[#03396c]/90 min-h-screen", children: [_jsxs("div", { className: "mb-8 border border-[#65c6c4] rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-[#03396c] to-[#65c6c4] p-4", children: _jsxs("h2", { className: "text-2xl font-bold text-white flex items-center", children: [_jsx(User, { className: "mr-2" }), " Gesti\u00F3n de Entrenadores FITPOWER"] }) }), _jsx("div", { className: "pt-6 bg-[#f2e6b6] p-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("button", { onClick: openCreateDialog, className: "bg-[#b2d3a7] hover:bg-[#65c6c4] text-[#03396c] px-4 py-2 rounded flex items-center", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Nuevo Entrenador"] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("label", { className: "flex items-center cursor-pointer text-[#03396c]", children: [_jsx("input", { type: "checkbox", checked: showInactive, onChange: (e) => setShowInactive(e.target.checked), className: "w-4 h-4 text-[#03396c] bg-[#f2e6b6] border-[#65c6c4] rounded focus:ring-[#65c6c4] focus:ring-2" }), _jsx("span", { className: "ml-2 font-medium", children: "Mostrar entrenadores inhabilitados" })] }) })] }) })] }), _jsx("div", { className: "border border-[#65c6c4] rounded-lg overflow-hidden", children: _jsx("div", { className: "bg-[#f2e6b6] p-4", children: isLoading ? (_jsx("div", { className: "text-center py-4", children: "Cargando entrenadores..." })) : trainers.length === 0 ? (_jsx("div", { className: "text-center py-4", children: showInactive ? 'No hay entrenadores registrados' : 'No hay entrenadores activos registrados' })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#65c6c4]", children: [_jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Nombre" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "DNI" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Email" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Especializaci\u00F3n" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Estado" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Acciones" })] }) }), _jsx("tbody", { children: trainers.map((trainer) => (_jsxs("tr", { className: "hover:bg-[#b2d3a7]", children: [_jsx("td", { className: "font-medium text-[#03396c] p-2 text-center", children: `${trainer.name || ""} ${trainer.lastName || ""}` }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: trainer.dni || "" }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: trainer.email || "" }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: trainer.specialization || "" }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: _jsx("div", { className: `flex items-center justify-center ${trainer.active
                                                                ? "text-green-600"
                                                                : "text-red-600"}`, children: trainer.active ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: "Activo" })] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: "Inactivo" })] })) }) }), _jsx("td", { className: "p-2", children: _jsxs("div", { className: "flex space-x-2 justify-center", children: [_jsx("button", { onClick: () => openEditDialog(trainer), className: "text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => toggleTrainerStatus(trainer.id, trainer.active), className: `${trainer.active
                                                                        ? "text-[#f8c471] hover:bg-[#f8c471]"
                                                                        : "text-[#b2d3a7] hover:bg-[#b2d3a7]"} hover:text-[#f2e6b6] p-1 rounded`, children: trainer.active ? (_jsx(Trash2, { className: "h-4 w-4" })) : (_jsx(CheckCircle, { className: "h-4 w-4" })) })] }) })] }, trainer.id))) })] }) })) }) }), isDialogOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("h3", { className: "text-2xl font-bold text-[#03396c] mb-4", children: [editingTrainer ? "Editar" : "Crear", " Entrenador"] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "name", className: "flex items-center text-[#03396c]", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), " Nombre*"] }), _jsx("input", { id: "name", name: "name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.name ? "border-red-500" : "border-[#65c6c4]"} text-[#03396c] rounded` }), errors.name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "lastName", className: "flex items-center text-[#03396c]", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), " Apellido*"] }), _jsx("input", { id: "lastName", name: "lastName", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.lastName
                                                                ? "border-red-500"
                                                                : "border-[#65c6c4]"} text-[#03396c] rounded` }), errors.lastName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.lastName }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "dni", className: "flex items-center text-[#03396c]", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), " DNI*"] }), _jsx("input", { id: "dni", name: "dni", value: formData.dni, onChange: (e) => setFormData({ ...formData, dni: e.target.value }), disabled: editingTrainer !== null, className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.dni ? "border-red-500" : "border-[#65c6c4]"} text-[#03396c] rounded ${editingTrainer ? "opacity-50 cursor-not-allowed" : ""}` }), errors.dni && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.dni }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "email", className: "flex items-center text-[#03396c]", children: [_jsx(Mail, { className: "w-4 h-4 mr-2" }), " Email*"] }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.email ? "border-red-500" : "border-[#65c6c4]"} text-[#03396c] rounded` }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "phoneNumber", className: "flex items-center text-[#03396c]", children: [_jsx(Phone, { className: "w-4 h-4 mr-2" }), " Tel\u00E9fono*"] }), _jsx("input", { id: "phoneNumber", name: "phoneNumber", value: formData.phoneNumber, onChange: (e) => setFormData({
                                                                ...formData,
                                                                phoneNumber: e.target.value,
                                                            }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.phoneNumber
                                                                ? "border-red-500"
                                                                : "border-[#65c6c4]"} text-[#03396c] rounded` }), errors.phoneNumber && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phoneNumber }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "address", className: "flex items-center text-[#03396c]", children: [_jsx(MapPin, { className: "w-4 h-4 mr-2" }), " Direcci\u00F3n*"] }), _jsx("input", { id: "address", name: "address", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.address ? "border-red-500" : "border-[#65c6c4]"} text-[#03396c] rounded` }), errors.address && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.address }))] }), _jsxs("div", { className: "col-span-2", children: [_jsxs("label", { htmlFor: "specialization", className: "flex items-center text-[#03396c]", children: [_jsx(Target, { className: "w-4 h-4 mr-2" }), " Especializaci\u00F3n*"] }), _jsx("input", { id: "specialization", name: "specialization", value: formData.specialization || "", onChange: (e) => setFormData({
                                                                ...formData,
                                                                specialization: e.target.value,
                                                            }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.specialization
                                                                ? "border-red-500"
                                                                : "border-[#65c6c4]"} text-[#03396c] rounded` }), errors.specialization && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.specialization }))] }), _jsxs("div", { className: "col-span-2", children: [_jsxs("label", { htmlFor: "gymName", className: "flex items-center text-[#03396c]", children: [_jsx(Building, { className: "w-4 h-4 mr-2" }), " Gimnasio*"] }), _jsxs("select", { id: "gymName", name: "gymName", value: formData.gymName, onChange: (e) => setFormData({ ...formData, gymName: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.gymName ? "border-red-500" : "border-[#65c6c4]"} text-[#03396c] rounded`, children: [_jsx("option", { value: "", children: "Selecciona un gimnasio" }), gyms.map((gym) => (_jsx("option", { value: gym.name, children: gym.name }, gym.id)))] }), errors.gymName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.gymName }))] }), editingTrainer && (_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "flex items-center text-[#03396c] mb-2", children: "Estado del Entrenador" }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", className: "form-radio h-4 w-4 text-green-600", name: "active", checked: formData.active, onChange: () => setFormData({ ...formData, active: true }) }), _jsxs("span", { className: "ml-2 flex items-center", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 mr-1" }), "Activo"] })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", className: "form-radio h-4 w-4 text-red-600", name: "active", checked: !formData.active, onChange: () => setFormData({ ...formData, active: false }) }), _jsxs("span", { className: "ml-2 flex items-center", children: [_jsx(XCircle, { className: "h-5 w-5 text-red-600 mr-1" }), "Inactivo"] })] })] })] }))] }), _jsxs("div", { className: "flex justify-end pt-4", children: [_jsx("button", { type: "button", onClick: closeDialog, className: "bg-[#e74c3c] text-white px-4 py-2 rounded mr-2", children: "Cancelar" }), _jsxs("button", { type: "submit", disabled: isSubmitting, className: `bg-[#2ecc71] text-white px-4 py-2 rounded ${isSubmitting ? "opacity-50 cursor-not-allowed" : ""}`, children: [isSubmitting
                                                            ? "Procesando..."
                                                            : editingTrainer
                                                                ? "Actualizar"
                                                                : "Crear", " ", "Entrenador"] })] })] })] }) }))] }), _jsx(FooterPag, {})] }));
}
