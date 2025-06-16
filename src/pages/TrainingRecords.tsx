import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FooterPag } from '../components/Footer';

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
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState<boolean>(false);
  const [editingRecord, setEditingRecord] = useState<TrainingRecord | null>(null);
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

  const confirmDelete = async (recordId: number) => {
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

  const handleDelete = async (recordId: number) => {
    toast.info(
      <div>
        <p>¿Estás seguro de eliminar este registro?</p>
        <div className="flex justify-center space-x-4 mt-2">
          <button 
            onClick={() => {
              toast.dismiss();
              confirmDelete(recordId);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded"
          >
            Eliminar
          </button>
          <button 
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-500 text-white rounded"
          >
            Cancelar
          </button>
        </div>
      </div>,
      {
        autoClose: false,
        closeButton: false,
      }
    );
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

  const formatDate = (dateString: string) => {
    return format(parseISO(dateString), "PPpp", { locale: es });
  };

  const formatRestTime = (timeString: string) => {
    const [hours, minutes, seconds] = timeString.split(':');
    return `${minutes}' ${seconds}''`;
  };

  // Componente para el formulario inline
  const InlineEditForm = ({ record }: { record: TrainingRecord }) => (
    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4 mt-4">
      <div className="flex justify-between items-center mb-4">
        <h4 className="text-lg font-semibold text-blue-800">Editando: {record.exerciseName}</h4>
        <button 
          onClick={resetForm}
          className="text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ejercicio</label>
          <select
            name="exerciseId"
            value={formData.exerciseId}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          >
            <option value="">Selecciona un ejercicio</option>
            {exercises.map(exercise => (
              <option key={exercise.id} value={exercise.id}>{exercise.name}</option>
            ))}
          </select>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
            <input
              type="number"
              name="series"
              min="1"
              value={formData.series}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Repeticiones</label>
            <input
              type="number"
              name="repetitions"
              min="1"
              value={formData.repetitions}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
            <input
              type="number"
              name="weight"
              step="0.1"
              min="0"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Descanso (HH:mm:ss)</label>
          <input
            type="text"
            name="restTime"
            value={formData.restTime}
            onChange={handleInputChange}
            placeholder="00:01:30"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
            pattern="\d{2}:\d{2}:\d{2}"
            title="Formato HH:mm:ss"
          />
          <p className="text-xs text-gray-500 mt-1">Ejemplo: 00:01:30 para 1 minuto y 30 segundos</p>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
          <textarea
            name="observation"
            rows={3}
            value={formData.observation}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          ></textarea>
        </div>
        
        <div className="flex justify-end space-x-3">
          <button
            type="button"
            onClick={resetForm}
            className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Actualizar
          </button>
        </div>
      </form>
    </div>
  );

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Cargando registros de entrenamiento...</p>
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
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center text-white hover:text-indigo-200"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Volver
          </button>
          <h1 className="text-2xl font-bold">Registros de Entrenamiento</h1>
          <div className="w-10"></div>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Mis Registros</h2>
          <button
            onClick={() => setShowForm(true)}
            className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Nuevo Registro
          </button>
        </div>

        {showForm && !editingRecord && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border border-gray-200">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Nuevo Registro</h3>
              <button 
                onClick={resetForm}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ejercicio</label>
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
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Series</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Repeticiones</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Peso (kg)</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Tiempo de Descanso (HH:mm:ss)</label>
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
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                  name="observation"
                  rows={3}
                  value={formData.observation}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                ></textarea>
              </div>
              
              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        )}

        {records.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <h3 className="mt-2 text-lg font-medium text-gray-900">No hay registros</h3>
            <p className="mt-1 text-sm text-gray-500">Empieza registrando tu primer entrenamiento.</p>
            <div className="mt-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors inline-flex items-center"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Crear Registro
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {records.map(record => (
              <div key={record.id} className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200">
                <div className="p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-indigo-700">{record.exerciseName}</h3>
                      <p className="text-sm text-gray-500">{formatDate(record.createdAt)}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(record)}
                        className="text-blue-500 hover:text-blue-700"
                        title="Editar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => handleDelete(record.id)}
                        className="text-red-500 hover:text-red-700"
                        title="Eliminar"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Series</p>
                      <p className="font-bold">{record.series}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Repeticiones</p>
                      <p className="font-bold">{record.repetitions}</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Peso</p>
                      <p className="font-bold">{record.weight} kg</p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded">
                      <p className="text-sm text-gray-500">Descanso</p>
                      <p className="font-bold">{formatRestTime(record.restTime)}</p>
                    </div>
                  </div>
                  
                  {record.observation && (
                    <div className="mt-4">
                      <p className="text-sm text-gray-500">Observaciones</p>
                      <p className="italic">{record.observation}</p>
                    </div>
                  )}
                </div>
                
                {/* Formulario de edición inline */}
                {editingRecord && editingRecord.id === record.id && (
                  <InlineEditForm record={record} />
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <FooterPag></FooterPag>
    </div>
  );
};

export default TrainingRecordsPage;