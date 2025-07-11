"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { Plus, Pencil, Trash2, User, Mail, Phone, MapPin, Target, Building, CheckCircle, XCircle } from "lucide-react";
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import axios from 'axios';
import { FooterPag } from "../../components/Footer";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../auth/hook/useAuth";
import { AdminHeader } from "../../components/AdminHeader";
export default function ClientCrud() {
    const token = localStorage.getItem("token") || "";
    const [clients, setClients] = useState([]);
    const [gyms, setGyms] = useState([]);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const [showInactive, setShowInactive] = useState(false); // Nuevo estado para el checkbox
    const [formData, setFormData] = useState({
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
    const [errors, setErrors] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const navigate = useNavigate();
    const { logout } = useAuth();
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
        }
        catch (error) {
            toast.error('Error al cargar los datos');
            console.error('Error fetching data:', error);
        }
        finally {
            setIsLoading(false);
        }
    };
    // Nueva función específica para obtener clientes
    const fetchClients = async () => {
        try {
            const clientsResponse = await api.get(`/clients/all?includeInactive=${showInactive}`);
            setClients(clientsResponse.data);
        }
        catch (error) {
            toast.error('Error al cargar los clientes');
            console.error('Error fetching clients:', error);
        }
    };
    const validateForm = () => {
        const newErrors = {};
        if (!formData.name?.trim()) {
            newErrors.name = 'Nombre es requerido';
        }
        else if (formData.name.length > 50) {
            newErrors.name = 'Nombre debe tener menos de 50 caracteres';
        }
        if (!formData.lastName?.trim()) {
            newErrors.lastName = 'Apellido es requerido';
        }
        else if (formData.lastName.length > 50) {
            newErrors.lastName = 'Apellido debe tener menos de 50 caracteres';
        }
        if (!formData.dni?.trim()) {
            newErrors.dni = 'DNI es requerido';
        }
        else if (!/^[0-9]{7,10}$/.test(formData.dni)) {
            newErrors.dni = 'DNI debe ser un número válido con 7 a 10 dígitos';
        }
        if (!formData.email?.trim()) {
            newErrors.email = 'Email es requerido';
        }
        else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
            newErrors.email = 'Email debe ser válido';
        }
        if (!formData.phoneNumber?.trim()) {
            newErrors.phoneNumber = 'Teléfono es requerido';
        }
        if (!formData.address?.trim()) {
            newErrors.address = 'Dirección es requerida';
        }
        else if (formData.address.length > 200) {
            newErrors.address = 'Dirección debe tener menos de 200 caracteres';
        }
        if (!formData.goal?.trim()) {
            newErrors.goal = 'Objetivo es requerido';
        }
        else if (formData.goal.length > 200) {
            newErrors.goal = 'Objetivo debe tener menos de 200 caracteres';
        }
        if (!formData.initialPhysicalCondition?.trim()) {
            newErrors.initialPhysicalCondition = 'Condición física inicial es requerida';
        }
        else if (formData.initialPhysicalCondition.length > 100) {
            newErrors.initialPhysicalCondition = 'Condición física inicial debe tener menos de 100 caracteres';
        }
        if (!formData.gymName?.trim()) {
            newErrors.gymName = 'Gimnasio es requerido';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    const handleSubmit = async (e) => {
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
            }
            else {
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
        }
        catch (error) {
            console.error('Error:', error);
            toast.error(error.response?.data?.message || 'Error al procesar la solicitud');
        }
        finally {
            setIsSubmitting(false);
        }
    };
    const toggleClientStatus = async (clientId, currentStatus) => {
        const action = currentStatus ? 'inhabilitar' : 'habilitar';
        const confirmAction = window.confirm(`¿Estás seguro de que deseas ${action} este cliente?`);
        if (confirmAction) {
            try {
                await api.patch(`/clients/${clientId}/status`, { active: !currentStatus });
                toast.success(`Cliente ${action}do correctamente`);
                fetchClients(); // Actualizado para usar la nueva función
            }
            catch (error) {
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
    const openEditDialog = (client) => {
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
    const handleLogout = () => {
        logout();
        navigate("/");
    };
    return (_jsxs("div", { className: "min-h-screen bg-[url('https://img.freepik.com/free-photo/3d-gym-equipment_23-2151114137.jpg')] bg-cover bg-center bg-no-repeat", children: [_jsx(AdminHeader, { onLogout: handleLogout }), _jsx(ToastContainer, { position: "top-right", autoClose: 5000 }), _jsxs("div", { className: "container mx-auto px-4 py-8 bg-[#03396c]/90 min-h-screen", children: [_jsxs("div", { className: "mb-8 border border-[#65c6c4] rounded-lg overflow-hidden", children: [_jsx("div", { className: "bg-gradient-to-r from-[#03396c] to-[#65c6c4] p-4", children: _jsxs("h2", { className: "text-2xl font-bold text-white flex items-center", children: [_jsx(User, { className: "mr-2" }), " Gesti\u00F3n de Clientes FITPOWER"] }) }), _jsx("div", { className: "pt-6 bg-[#f2e6b6] p-4", children: _jsxs("div", { className: "flex justify-between items-center", children: [_jsxs("button", { onClick: openCreateDialog, className: "bg-[#b2d3a7] hover:bg-[#65c6c4] text-[#03396c] px-4 py-2 rounded flex items-center", children: [_jsx(Plus, { className: "mr-2 h-4 w-4" }), " Nuevo Cliente"] }), _jsx("div", { className: "flex items-center space-x-2", children: _jsxs("label", { className: "flex items-center cursor-pointer text-[#03396c]", children: [_jsx("input", { type: "checkbox", checked: showInactive, onChange: (e) => setShowInactive(e.target.checked), className: "w-4 h-4 text-[#03396c] bg-[#f2e6b6] border-[#65c6c4] rounded focus:ring-[#65c6c4] focus:ring-2" }), _jsx("span", { className: "ml-2 font-medium", children: "Mostrar clientes inhabilitados" })] }) })] }) })] }), _jsx("div", { className: "border border-[#65c6c4] rounded-lg overflow-hidden", children: _jsx("div", { className: "bg-[#f2e6b6] p-4", children: isLoading ? (_jsx("div", { className: "text-center py-4", children: "Cargando clientes..." })) : clients.length === 0 ? (_jsx("div", { className: "text-center py-4", children: showInactive ? 'No hay clientes registrados' : 'No hay clientes activos registrados' })) : (_jsx("div", { className: "overflow-x-auto", children: _jsxs("table", { className: "w-full", children: [_jsx("thead", { children: _jsxs("tr", { className: "bg-[#65c6c4]", children: [_jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Nombre" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "DNI" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Email" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Tel\u00E9fono" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Estado" }), _jsx("th", { className: "font-bold text-[#03396c] p-2", children: "Acciones" })] }) }), _jsx("tbody", { children: clients.map((client) => (_jsxs("tr", { className: "hover:bg-[#b2d3a7]", children: [_jsx("td", { className: "font-medium text-[#03396c] p-2 text-center", children: `${client.name || ''} ${client.lastName || ''}` }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: client.dni || '' }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: client.email || '' }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: client.phoneNumber || '' }), _jsx("td", { className: "text-[#03396c] p-2 text-center", children: _jsx("div", { className: `flex items-center justify-center ${client.active ? 'text-green-600' : 'text-red-600'}`, children: client.active ? (_jsxs(_Fragment, { children: [_jsx(CheckCircle, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: "Activo" })] })) : (_jsxs(_Fragment, { children: [_jsx(XCircle, { className: "h-5 w-5 mr-1" }), _jsx("span", { children: "Inactivo" })] })) }) }), _jsx("td", { className: "p-2", children: _jsxs("div", { className: "flex space-x-2 justify-center", children: [_jsx("button", { onClick: () => openEditDialog(client), className: "text-[#03396c] hover:text-[#65c6c4] hover:bg-[#03396c] p-1 rounded", children: _jsx(Pencil, { className: "h-4 w-4" }) }), _jsx("button", { onClick: () => toggleClientStatus(client.id, client.active), className: `${client.active ? 'text-[#f8c471] hover:bg-[#f8c471]' : 'text-[#b2d3a7] hover:bg-[#b2d3a7]'} hover:text-[#f2e6b6] p-1 rounded`, children: client.active ? (_jsx(Trash2, { className: "h-4 w-4" })) : (_jsx(CheckCircle, { className: "h-4 w-4" })) })] }) })] }, client.id))) })] }) })) }) }), isDialogOpen && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-[#f2e6b6] p-6 rounded-lg max-w-xl w-full max-h-[90vh] overflow-y-auto", children: [_jsxs("h3", { className: "text-2xl font-bold text-[#03396c] mb-4", children: [editingClient ? 'Editar' : 'Crear', " Cliente"] }), _jsxs("form", { onSubmit: handleSubmit, className: "space-y-4", children: [_jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs("div", { children: [_jsxs("label", { htmlFor: "name", className: "flex items-center text-[#03396c]", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), " Nombre*"] }), _jsx("input", { id: "name", name: "name", value: formData.name, onChange: (e) => setFormData({ ...formData, name: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.name ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.name && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.name }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "lastName", className: "flex items-center text-[#03396c]", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), " Apellido*"] }), _jsx("input", { id: "lastName", name: "lastName", value: formData.lastName, onChange: (e) => setFormData({ ...formData, lastName: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.lastName ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.lastName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.lastName }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "dni", className: "flex items-center text-[#03396c]", children: [_jsx(User, { className: "w-4 h-4 mr-2" }), " DNI*"] }), _jsx("input", { id: "dni", name: "dni", value: formData.dni, onChange: (e) => setFormData({ ...formData, dni: e.target.value }), disabled: editingClient !== null, className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.dni ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded ${editingClient ? 'opacity-50 cursor-not-allowed' : ''}` }), errors.dni && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.dni }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "email", className: "flex items-center text-[#03396c]", children: [_jsx(Mail, { className: "w-4 h-4 mr-2" }), " Email*"] }), _jsx("input", { id: "email", name: "email", type: "email", value: formData.email, onChange: (e) => setFormData({ ...formData, email: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.email ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.email && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.email }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "phoneNumber", className: "flex items-center text-[#03396c]", children: [_jsx(Phone, { className: "w-4 h-4 mr-2" }), " Tel\u00E9fono*"] }), _jsx("input", { id: "phoneNumber", name: "phoneNumber", value: formData.phoneNumber, onChange: (e) => setFormData({ ...formData, phoneNumber: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.phoneNumber ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.phoneNumber && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.phoneNumber }))] }), _jsxs("div", { children: [_jsxs("label", { htmlFor: "address", className: "flex items-center text-[#03396c]", children: [_jsx(MapPin, { className: "w-4 h-4 mr-2" }), " Direcci\u00F3n*"] }), _jsx("input", { id: "address", name: "address", value: formData.address, onChange: (e) => setFormData({ ...formData, address: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.address ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.address && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.address }))] }), _jsxs("div", { className: "col-span-2", children: [_jsxs("label", { htmlFor: "goal", className: "flex items-center text-[#03396c]", children: [_jsx(Target, { className: "w-4 h-4 mr-2" }), " Objetivo*"] }), _jsx("textarea", { id: "goal", name: "goal", value: formData.goal || "", onChange: (e) => setFormData({ ...formData, goal: e.target.value }), rows: 3, className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.goal ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.goal && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.goal }))] }), _jsxs("div", { className: "col-span-2", children: [_jsxs("label", { htmlFor: "initialPhysicalCondition", className: "flex items-center text-[#03396c]", children: [_jsx(Target, { className: "w-4 h-4 mr-2" }), " Condici\u00F3n F\u00EDsica Inicial*"] }), _jsx("textarea", { id: "initialPhysicalCondition", name: "initialPhysicalCondition", value: formData.initialPhysicalCondition || "", onChange: (e) => setFormData({ ...formData, initialPhysicalCondition: e.target.value }), rows: 3, className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.initialPhysicalCondition ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded` }), errors.initialPhysicalCondition && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.initialPhysicalCondition }))] }), _jsxs("div", { className: "col-span-2", children: [_jsxs("label", { htmlFor: "gymName", className: "flex items-center text-[#03396c]", children: [_jsx(Building, { className: "w-4 h-4 mr-2" }), " Gimnasio*"] }), _jsxs("select", { id: "gymName", name: "gymName", value: formData.gymName, onChange: (e) => setFormData({ ...formData, gymName: e.target.value }), className: `mt-1 w-full p-2 bg-[#f2e6b6] border ${errors.gymName ? 'border-red-500' : 'border-[#65c6c4]'} text-[#03396c] rounded`, children: [_jsx("option", { value: "", children: "Selecciona un gimnasio" }), gyms.map((gym) => (_jsx("option", { value: gym.name, children: gym.name }, gym.id)))] }), errors.gymName && (_jsx("p", { className: "mt-1 text-sm text-red-600", children: errors.gymName }))] }), editingClient && (_jsxs("div", { className: "col-span-2", children: [_jsx("label", { className: "flex items-center text-[#03396c] mb-2", children: "Estado del Cliente" }), _jsxs("div", { className: "flex space-x-4", children: [_jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", className: "form-radio h-4 w-4 text-green-600", name: "active", checked: formData.active, onChange: () => setFormData({ ...formData, active: true }) }), _jsxs("span", { className: "ml-2 flex items-center", children: [_jsx(CheckCircle, { className: "h-5 w-5 text-green-600 mr-1" }), "Activo"] })] }), _jsxs("label", { className: "flex items-center", children: [_jsx("input", { type: "radio", className: "form-radio h-4 w-4 text-red-600", name: "active", checked: !formData.active, onChange: () => setFormData({ ...formData, active: false }) }), _jsxs("span", { className: "ml-2 flex items-center", children: [_jsx(XCircle, { className: "h-5 w-5 text-red-600 mr-1" }), "Inactivo"] })] })] })] }))] }), _jsxs("div", { className: "flex justify-end pt-4", children: [_jsx("button", { type: "button", onClick: closeDialog, className: "bg-[#e74c3c] text-white px-4 py-2 rounded mr-2", children: "Cancelar" }), _jsxs("button", { type: "submit", disabled: isSubmitting, className: `bg-[#2ecc71] text-white px-4 py-2 rounded ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`, children: [isSubmitting ? 'Procesando...' : editingClient ? 'Actualizar' : 'Crear', " Cliente"] })] })] })] }) }))] }), _jsx(FooterPag, {})] }));
}
