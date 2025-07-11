import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MealTime } from '../../model/MealTime';
import { FooterPag } from '../../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { validateNutritionRecordRequest } from '../../model/NutritionRecordCreateRequestDto';
const NutritionRecordsPage = () => {
    const [records, setRecords] = useState([]);
    const [filteredRecords, setFilteredRecords] = useState([]);
    const { nutritionPlanId } = useParams();
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [newRecord, setNewRecord] = useState({
        calories: 0,
        proteins: 0,
        carbohydrates: 0,
        fats: 0,
        food: '',
        mealTime: MealTime.BREAKFAST,
        observations: ''
    });
    const navigate = useNavigate();
    const { dni, planId } = useParams();
    useEffect(() => {
        const fetchRecords = async () => {
            try {
                const token = localStorage.getItem('token');
                const clientDni = dni || localStorage.getItem('userDni');
                if (!clientDni || !nutritionPlanId) {
                    throw new Error('Datos incompletos para cargar registros');
                }
                const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${nutritionPlanId}/nutrition-records`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error(`Error al obtener registros: ${response.statusText}`);
                }
                const data = await response.json();
                setRecords(data);
            }
            catch (err) {
                const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
                toast.error(`Error al cargar registros: ${errorMessage}`);
            }
            finally {
                setLoading(false);
            }
        };
        fetchRecords();
    }, [dni, planId]);
    useEffect(() => {
        const filtered = records.filter(record => {
            const recordDate = new Date(record.createdAt).toISOString().split('T')[0];
            return recordDate === selectedDate;
        });
        setFilteredRecords(filtered);
    }, [records, selectedDate]);
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        if (['calories', 'proteins', 'carbohydrates', 'fats'].includes(name)) {
            const numericValue = parseInt(value) || 0;
            if (numericValue < 0) {
                toast.error(`${name === 'calories' ? 'Las calorías' :
                    name === 'proteins' ? 'Las proteínas' :
                        name === 'carbohydrates' ? 'Los carbohidratos' :
                            'Las grasas'} deben ser un valor positivo`);
                return;
            }
            setNewRecord(prev => ({
                ...prev,
                [name]: numericValue
            }));
        }
        else {
            setNewRecord(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        // Validar usando la función de validación
        const validationErrors = validateNutritionRecordRequest(newRecord);
        if (validationErrors.length > 0) {
            validationErrors.forEach(error => toast.error(error));
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const clientDni = dni || localStorage.getItem('userDni');
            if (!clientDni || !nutritionPlanId) {
                throw new Error('Datos incompletos para crear el registro');
            }
            const url = editingRecord
                ? `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${nutritionPlanId}/nutrition-records/${editingRecord.id}`
                : `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${nutritionPlanId}/nutrition-records`;
            const method = editingRecord ? 'PUT' : 'POST';
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newRecord),
            });
            if (!response.ok) {
                throw new Error(`Error al ${editingRecord ? 'actualizar' : 'crear'} registro: ${response.statusText}`);
            }
            const recordData = await response.json();
            if (editingRecord) {
                setRecords(records.map(r => r.id === recordData.id ? recordData : r));
                toast.success('Registro actualizado correctamente');
            }
            else {
                setRecords([...records, recordData]);
                toast.success('Registro creado correctamente');
            }
            resetForm();
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : `Error al ${editingRecord ? 'actualizar' : 'crear'} registro`;
            toast.error(errorMessage);
        }
    };
    const handleEdit = (record) => {
        setEditingRecord(record);
        setNewRecord({
            calories: record.calories,
            proteins: record.proteins,
            carbohydrates: record.carbohydrates,
            fats: record.fats,
            food: record.food,
            mealTime: record.mealTime,
            observations: record.observations || ''
        });
        setShowForm(true);
        toast.info('Editando registro existente');
    };
    const confirmDelete = (recordId) => {
        toast.warning(_jsxs("div", { children: [_jsx("p", { children: "\u00BFEst\u00E1s seguro de que deseas eliminar este registro?" }), _jsxs("div", { className: "flex justify-end mt-4", children: [_jsx("button", { onClick: () => {
                                handleDelete(recordId);
                                toast.dismiss();
                            }, className: "px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mr-2", children: "S\u00ED" }), _jsx("button", { onClick: () => toast.dismiss(), className: "px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors", children: "No" })] })] }), {
            position: "top-center",
            autoClose: false,
            closeOnClick: false,
            draggable: false,
        });
    };
    const handleDelete = async (recordId) => {
        try {
            const token = localStorage.getItem('token');
            const clientDni = dni || localStorage.getItem('userDni');
            if (!clientDni || !nutritionPlanId) {
                throw new Error('Datos incompletos para eliminar el registro');
            }
            const response = await fetch(`http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${nutritionPlanId}/nutrition-records/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (!response.ok) {
                throw new Error(`Error al eliminar registro: ${response.statusText}`);
            }
            setRecords(records.filter(r => r.id !== recordId));
            toast.success('Registro eliminado correctamente');
        }
        catch (err) {
            const errorMessage = err instanceof Error ? err.message : 'Error al eliminar registro';
            toast.error(errorMessage);
        }
    };
    const resetForm = () => {
        setNewRecord({
            calories: 0,
            proteins: 0,
            carbohydrates: 0,
            fats: 0,
            food: '',
            mealTime: MealTime.BREAKFAST,
            observations: ''
        });
        setEditingRecord(null);
        setShowForm(false);
    };
    if (loading) {
        return (_jsxs("div", { className: "flex flex-col items-center justify-center min-h-screen bg-gray-50", children: [_jsx("div", { className: "w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" }), _jsx("p", { className: "mt-4 text-lg text-gray-600", children: "Cargando registros de nutrici\u00F3n..." }), _jsx(ToastContainer, {})] }));
    }
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(ToastContainer, { position: "top-right", autoClose: 5000, hideProgressBar: false, newestOnTop: false, closeOnClick: true, rtl: false, pauseOnFocusLoss: true, draggable: true, pauseOnHover: true }), _jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al Plan" })] }) }), _jsx("nav", { className: "bg-white shadow-sm", children: _jsxs("ul", { className: "container mx-auto px-4 flex", children: [_jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Inicio" }) }), _jsx("li", { className: "flex-1 text-center hover:bg-gray-50 transition-colors", children: _jsx("button", { onClick: () => navigate("/client/training-plan"), className: "w-full py-4 font-medium text-gray-600 hover:text-gray-900", children: "Plan de Entrenamiento" }) }), _jsx("li", { className: "flex-1 text-center border-b-4 border-red-500", children: _jsx("button", { className: "w-full py-4 font-medium text-red-500", children: "Plan de Nutrici\u00F3n" }) })] }) }), _jsxs("main", { className: "flex-grow container mx-auto px-4 py-8", children: [_jsxs("div", { className: "flex justify-between items-center mb-6", children: [_jsxs("div", { children: [_jsx("h2", { className: "text-2xl font-bold text-gray-800", children: "Registros de Comidas" }), _jsx("input", { type: "date", value: selectedDate, onChange: (e) => setSelectedDate(e.target.value), className: "mt-2 p-2 border rounded" })] }), _jsx("button", { onClick: () => {
                                    setEditingRecord(null);
                                    setNewRecord({
                                        calories: 0,
                                        proteins: 0,
                                        carbohydrates: 0,
                                        fats: 0,
                                        food: '',
                                        mealTime: MealTime.BREAKFAST,
                                        observations: ''
                                    });
                                    setShowForm(true);
                                }, className: "px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors", children: "+ Nuevo Registro" })] }), filteredRecords.length > 0 ? (_jsx("div", { className: "overflow-x-auto bg-white rounded-lg shadow-sm", children: _jsxs("table", { className: "min-w-full divide-y divide-gray-200", children: [_jsx("thead", { className: "bg-gray-50", children: _jsxs("tr", { children: [_jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Fecha" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Comida" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Momento" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Calor\u00EDas" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Prote\u00EDnas" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Carbohidratos" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Grasas" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Observaciones" }), _jsx("th", { className: "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider", children: "Acciones" })] }) }), _jsx("tbody", { className: "bg-white divide-y divide-gray-200", children: filteredRecords.map(record => (_jsxs("tr", { children: [_jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: new Date(record.createdAt).toLocaleDateString() }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: record.food }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: record.mealTime === MealTime.BREAKFAST ? 'Desayuno' :
                                                    record.mealTime === MealTime.LUNCH ? 'Almuerzo' :
                                                        record.mealTime === MealTime.SNACK ? 'Merienda' :
                                                            record.mealTime === MealTime.DINNER ? 'Cena' : 'Extra' }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [record.calories, " kcal"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [record.proteins, " g"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [record.carbohydrates, " g"] }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm text-gray-500", children: [record.fats, " g"] }), _jsx("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900", children: record.observations }), _jsxs("td", { className: "px-6 py-4 whitespace-nowrap text-sm font-medium", children: [_jsx("button", { onClick: () => handleEdit(record), className: "text-indigo-600 hover:text-indigo-900 mr-4", children: "Editar" }), _jsx("button", { onClick: () => confirmDelete(record.id), className: "text-red-600 hover:text-red-900", children: "Eliminar" })] })] }, record.id))) })] }) })) : (_jsxs("div", { className: "text-center py-8 bg-white rounded-lg shadow-sm", children: [_jsx("p", { className: "text-gray-500", children: "No hay registros de comidas para esta fecha." }), _jsx("button", { onClick: () => {
                                    setEditingRecord(null);
                                    setNewRecord({
                                        calories: 0,
                                        proteins: 0,
                                        carbohydrates: 0,
                                        fats: 0,
                                        food: '',
                                        mealTime: MealTime.BREAKFAST,
                                        observations: ''
                                    });
                                    setShowForm(true);
                                }, className: "mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors", children: "Crear Primer Registro" })] })), showForm && (_jsx("div", { className: "fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50", children: _jsxs("div", { className: "bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto", children: [_jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-4", children: editingRecord ? 'Editar Registro' : 'Nuevo Registro de Comida' }), _jsxs("form", { onSubmit: handleSubmit, children: [_jsxs("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-4 mb-4", children: [_jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Comida*" }), _jsx("input", { type: "text", name: "food", value: newRecord.food, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", required: true })] }), _jsxs("div", { className: "md:col-span-2", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Momento del d\u00EDa*" }), _jsx("select", { name: "mealTime", value: newRecord.mealTime, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", required: true, children: Object.values(MealTime).map((time) => (_jsx("option", { value: time, children: time === MealTime.BREAKFAST ? 'Desayuno' :
                                                                    time === MealTime.LUNCH ? 'Almuerzo' :
                                                                        time === MealTime.SNACK ? 'Merienda' :
                                                                            time === MealTime.DINNER ? 'Cena' : 'Extra' }, time))) })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Calor\u00EDas*" }), _jsx("input", { type: "number", name: "calories", value: newRecord.calories, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", required: true, min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Prote\u00EDnas* (g)" }), _jsx("input", { type: "number", name: "proteins", value: newRecord.proteins, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", required: true, min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Carbohidratos* (g)" }), _jsx("input", { type: "number", name: "carbohydrates", value: newRecord.carbohydrates, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", required: true, min: "0" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Grasas* (g)" }), _jsx("input", { type: "number", name: "fats", value: newRecord.fats, onChange: handleInputChange, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500", required: true, min: "0" })] })] }), _jsxs("div", { className: "mb-4", children: [_jsx("label", { className: "block text-sm font-medium text-gray-700 mb-1", children: "Observaciones" }), _jsx("textarea", { name: "observations", value: newRecord.observations, onChange: handleInputChange, rows: 3, className: "w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" })] }), _jsxs("div", { className: "flex justify-end space-x-3", children: [_jsx("button", { type: "button", onClick: resetForm, className: "px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors", children: "Cancelar" }), _jsx("button", { type: "submit", className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: editingRecord ? 'Actualizar' : 'Guardar' })] })] })] }) }))] }), _jsx(FooterPag, {})] }));
};
export default NutritionRecordsPage;
