import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FooterPag } from '../../components/Footer';

interface TrainingRecord {
  id: number;
  observation: string | null;
  createdAt: string;
  series: number;
  repetitions: number;
  weight: number;
  restTime: string;
  exerciseId: number;
  trainingPlanId: number;
  exerciseName?: string;
}

interface Exercise {
  id: number;
  name: string;
}

const TrainingRecordsPage: React.FC = () => {
  const { trainingPlanId } = useParams<{ trainingPlanId: string }>();
  const [records, setRecords] = useState<TrainingRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<TrainingRecord[]>([]);
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
  const [selectedDate, setSelectedDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const token = localStorage.getItem('token');

  const [formData, setFormData] = useState({
    observation: '',
    series: 3,
    repetitions: 10,
    weight: 0,
    restTime: '00:01:30',
    exerciseId: 0
  });
  const navigate = useNavigate();

  const clientDni = localStorage.getItem('userDni') || '';

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        const exercisesResponse = await fetch(`http://localhost:8080/api/v1/exercises`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (!exercisesResponse.ok) throw new Error('Error al cargar ejercicios');
        const exercisesData = await exercisesResponse.json();
        setExercises(exercisesData);
        
        const recordsResponse = await fetch(
          `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records`,
          { headers: { 'Authorization': `Bearer ${token}` } }
        );
        
        if (!recordsResponse.ok) throw new Error('Error al cargar registros');
        
        const recordsData: TrainingRecord[] = await recordsResponse.json();
        const recordsWithExerciseNames = recordsData.map(record => {
          const exercise = exercisesData.find(ex => ex.id === record.exerciseId);
          return {
            ...record,
            exerciseName: exercise ? exercise.name : 'Ejercicio desconocido'
          };
        });
        
        setRecords(recordsWithExerciseNames);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
        toast.error(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [trainingPlanId, clientDni]);

  useEffect(() => {
    const filtered = records.filter(record => {
      const recordDate = new Date(record.createdAt).toISOString().split('T')[0];
      return recordDate === selectedDate;
    });
    setFilteredRecords(filtered);
  }, [records, selectedDate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'series' || name === 'repetitions' || name === 'weight' || name === 'exerciseId' 
        ? Number(value) 
        : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const url = editingRecord 
        ? `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records/${editingRecord.id}`
        : `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records`;
      
      const method = editingRecord ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          observation: formData.observation,
          series: formData.series,
          repetitions: formData.repetitions,
          weight: formData.weight,
          restTime: formData.restTime,
          exerciseId: formData.exerciseId
        })
      });
      
      if (!response.ok) throw new Error('Error al guardar el registro');
      
      const savedRecord: TrainingRecord = await response.json();
      
      if (editingRecord) {
        setRecords(prev => prev.map(r => r.id === savedRecord.id ? {
          ...savedRecord,
          exerciseName: exercises.find(ex => ex.id === savedRecord.exerciseId)?.name || 'Ejercicio desconocido'
        } : r));
        toast.success('Registro actualizado correctamente');
      } else {
        setRecords(prev => [{
          ...savedRecord,
          exerciseName: exercises.find(ex => ex.id === savedRecord.exerciseId)?.name || 'Ejercicio desconocido'
        }, ...prev]);
        toast.success('Registro creado correctamente');
      }
      
      resetForm();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al guardar';
      toast.error(errorMessage);
    }
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
      const response = await fetch(
        `http://localhost:8080/api/v1/clients/${clientDni}/training-plans/${trainingPlanId}/records/${recordId}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );
      
      if (!response.ok) throw new Error('Error al eliminar el registro');
      
      setRecords(prev => prev.filter(r => r.id !== recordId));
      toast.success('Registro eliminado correctamente');
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Ocurrió un error al eliminar';
      toast.error(errorMessage);
    }
  };

  const handleEdit = (record: TrainingRecord) => {
    setEditingRecord(record);
    setFormData({
      observation: record.observation || '',
      series: record.series,
      repetitions: record.repetitions,
      weight: record.weight,
      restTime: record.restTime,
      exerciseId: record.exerciseId
    });
    setShowForm(true);
    toast.info('Editando registro existente');
  };

  const resetForm = () => {
    setFormData({
      observation: '',
      series: 3,
      repetitions: 10,
      weight: 0,
      restTime: '00:01:30',
      exerciseId: exercises.length > 0 ? exercises[0].id : 0
    });
    setEditingRecord(null);
    setShowForm(false);
  };

  const formatRestTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return `${minutes}' ${seconds}''`;
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Cargando registros de entrenamiento...</p>
        <ToastContainer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Intentar nuevamente
        </button>
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
          <li className="flex-1 text-center border-b-4 border-red-500">
            <button className="w-full py-4 font-medium text-red-500">
              Plan de Entrenamiento
            </button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button
              onClick={() => navigate("/client/nutrition-plan")}
              className="w-full py-4 font-medium text-gray-600 hover:text-gray-900"
            >
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Registros de Entrenamiento</h2>
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
              setFormData({
                observation: '',
                series: 3,
                repetitions: 10,
                weight: 0,
                restTime: '00:01:30',
                exerciseId: exercises.length > 0 ? exercises[0].id : 0
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
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ejercicio</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Series</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Repeticiones</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Peso</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descanso</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Observación</th>
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
                      {record.exerciseName}
                
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.series}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.repetitions}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.weight} kg
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatRestTime(record.restTime)}
                    </td>
                         <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {record.observation}
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
            <p className="text-gray-500">No hay registros de entrenamiento para esta fecha.</p>
            <button
              onClick={() => {
                setEditingRecord(null);
                setFormData({
                  observation: '',
                  series: 3,
                  repetitions: 10,
                  weight: 0,
                  restTime: '00:01:30',
                  exerciseId: exercises.length > 0 ? exercises[0].id : 0
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
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">
                {editingRecord ? 'Editar Registro' : 'Nuevo Registro de Entrenamiento'}
              </h3>
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Ejercicio*</label>
                    <select
                      name="exerciseId"
                      value={formData.exerciseId}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                    >
                      <option value="">Selecciona un ejercicio</option>
                      {exercises.map(exercise => (
                        <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Series*</label>
                      <input
                        type="number"
                        name="series"
                        min="1"
                        value={formData.series}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Repeticiones*</label>
                      <input
                        type="number"
                        name="repetitions"
                        min="1"
                        value={formData.repetitions}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)*</label>
                      <input
                        type="number"
                        name="weight"
                        step="0.1"
                        min="0"
                        value={formData.weight}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Descanso*</label>
                    <input
                      type="text"
                      name="restTime"
                      value={formData.restTime}
                      onChange={handleInputChange}
                      placeholder="00:01:30"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      required
                      pattern="\d{2}:\d{2}:\d{2}"
                      title="Formato HH:mm:ss"
                    />
                    <p className="text-xs text-gray-500 mt-1">Ejemplo: 00:01:30 para 1 minuto y 30 segundos</p>
                  </div>
                </div>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                  <textarea
                    name="observation"
                    value={formData.observation}
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

export default TrainingRecordsPage;