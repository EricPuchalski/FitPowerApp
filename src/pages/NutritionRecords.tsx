import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { MealTime } from '../model/MealTime';
import { FooterPag } from '../components/Footer';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { NutritionRecordResponseDto } from '../model/NutritionRecordResponseDto';
import { NutritionRecordCreateRequestDto } from '../model/NutritionRecordCreateRequestDto';

const NutritionRecordsPage: React.FC = () => {
  const [records, setRecords] = useState<NutritionRecordResponseDto[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<NutritionRecordResponseDto[]>([]);
  const { nutritionPlanId } = useParams<{ nutritionPlanId: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<NutritionRecordResponseDto | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [newRecord, setNewRecord] = useState<NutritionRecordCreateRequestDto>({
    calories: 0,
    food: '',
    mealTime: MealTime.BREAKFAST,
    observations: ''
  });

  const navigate = useNavigate();
  const { dni, planId } = useParams<{ dni?: string; planId?: string }>();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const token = localStorage.getItem('token');
        const clientDni = dni || localStorage.getItem('userDni');

        if (!clientDni || !nutritionPlanId) {
          throw new Error('Datos incompletos para cargar registros');
        }

        const response = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${nutritionPlanId}/nutrition-records`,
          {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Error al obtener registros: ${response.statusText}`);
        }

        const data: NutritionRecordResponseDto[] = await response.json();
        setRecords(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error desconocido';
        toast.error(`Error al cargar registros: ${errorMessage}`);
      } finally {
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    if (name === 'calories') {
      const caloriesValue = parseInt(value) || 0;
      if (caloriesValue < 0) {
        toast.error('Las calorías deben ser un valor positivo');
        return;
      }
      setNewRecord(prev => ({
        ...prev,
        [name]: caloriesValue
      }));
    } else {
      setNewRecord(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newRecord.calories <= 0) {
      toast.error('Las calorías deben ser un valor positivo');
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

      const recordData: NutritionRecordResponseDto = await response.json();

      if (editingRecord) {
        setRecords(records.map(r => r.id === recordData.id ? recordData : r));
        toast.success('Registro actualizado correctamente');
      } else {
        setRecords([...records, recordData]);
        toast.success('Registro creado correctamente');
      }

      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : `Error al ${editingRecord ? 'actualizar' : 'crear'} registro`;
      toast.error(errorMessage);
    }
  };

  const handleEdit = (record: NutritionRecordResponseDto) => {
    setEditingRecord(record);
    setNewRecord({
      calories: record.calories,
      food: record.food,
      mealTime: record.mealTime,
      observations: record.observations || ''
    });
    setShowForm(true);
    toast.info('Editando registro existente');
  };

  const confirmDelete = (recordId: number) => {
    toast.warning(
      <div>
        <p>¿Estás seguro de que deseas eliminar este registro?</p>
        <div className="flex justify-end mt-4">
          <button
            onClick={() => {
              handleDelete(recordId);
              toast.dismiss();
            }}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors mr-2"
          >
            Sí
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
          >
            No
          </button>
        </div>
      </div>,
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
      }
    );
  };

  const handleDelete = async (recordId: number) => {
    try {
      const token = localStorage.getItem('token');
      const clientDni = dni || localStorage.getItem('userDni');

      if (!clientDni || !nutritionPlanId) {
        throw new Error('Datos incompletos para eliminar el registro');
      }

      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${clientDni}/nutrition-plans/${nutritionPlanId}/nutrition-records/${recordId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error al eliminar registro: ${response.statusText}`);
      }

      setRecords(records.filter(r => r.id !== recordId));
      toast.success('Registro eliminado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar registro';
      toast.error(errorMessage);
    }
  };

  const resetForm = () => {
    setNewRecord({
      calories: 0,
      food: '',
      mealTime: MealTime.BREAKFAST,
      observations: ''
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Cargando registros de nutrición...</p>
        <ToastContainer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
          >
            Volver al Plan
          </button>
        </div>
      </header>

      <nav className="bg-white shadow-sm">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Inicio
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/training-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Entrenamiento
            </button>
          </li>
          <li className="flex-1 text-center border-b-4 border-red-500">
            <button className="w-full py-4 font-medium text-red-500">
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registros de Comidas</h2>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="mt-2 p-2 border rounded"
            />
          </div>
          <button
            onClick={() => {
              setEditingRecord(null);
              setNewRecord({
                calories: 0,
                food: '',
                mealTime: MealTime.BREAKFAST,
                observations: ''
              });
              setShowForm(true);
            }}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
          >
            + Nuevo Registro
          </button>
        </div>

        {filteredRecords.length > 0 ? (
          <div className="overflow-x-auto bg-white rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Fecha</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Comida</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Momento</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calorías</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observacion</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Acciones</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredRecords.map(record => (
                  <tr key={record.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(record.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.food}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.mealTime === MealTime.BREAKFAST ? 'Desayuno' :
                      record.mealTime === MealTime.MID_MORNING ? 'Media Mañana' :
                      record.mealTime === MealTime.LUNCH ? 'Almuerzo' :
                      record.mealTime === MealTime.AFTERNOON_SNACK ? 'Merienda' :
                      record.mealTime === MealTime.DINNER ? 'Cena' : 'Refrigerio Nocturno'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.calories} kcal
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {record.observations}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleEdit(record)}
                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                      >
                        Editar
                      </button>
                      <button
                        onClick={() => confirmDelete(record.id)}
                        className="text-red-600 hover:text-red-900"
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-8 bg-white rounded-lg shadow-sm">
            <p className="text-gray-500">No hay registros de comidas para esta fecha.</p>
            <button
              onClick={() => {
                setEditingRecord(null);
                setNewRecord({
                  calories: 0,
                  food: '',
                  mealTime: MealTime.BREAKFAST,
                  observations: ''
                });
                setShowForm(true);
              }}
              className="mt-4 px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors"
            >
              Crear Primer Registro
            </button>
          </div>
        )}

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editingRecord ? 'Editar Registro' : 'Nuevo Registro de Comida'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comida*</label>
                    <input
                      type="text"
                      name="food"
                      value={newRecord.food}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Momento del día*</label>
                    <select
                      name="mealTime"
                      value={newRecord.mealTime}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      {Object.values(MealTime).map(time => (
                        <option key={time} value={time}>
                          {time === MealTime.BREAKFAST ? 'Desayuno' :
                          time === MealTime.MID_MORNING ? 'Media Mañana' :
                          time === MealTime.LUNCH ? 'Almuerzo' :
                          time === MealTime.AFTERNOON_SNACK ? 'Merienda' :
                          time === MealTime.DINNER ? 'Cena' : 'Refrigerio Nocturno'}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Calorías*</label>
                    <input
                      type="number"
                      name="calories"
                      value={newRecord.calories}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      min="0"
                    />
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    name="observations"
                    value={newRecord.observations}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  />
                </div>
                <div className="flex justify-end space-x-3">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="px-4 py-2 bg-gray-300 text-gray-800 rounded hover:bg-gray-400 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors"
                  >
                    {editingRecord ? 'Actualizar' : 'Guardar'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </main>

      <FooterPag />
    </div>
  );
};

export default NutritionRecordsPage;
