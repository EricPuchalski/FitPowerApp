import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterPag } from '../components/Footer';
import { TrainingPlan } from '../model/TrainingPlan';
import { ExerciseRoutine } from '../model/ExerciseRoutine';

const TrainingPlanPage: React.FC = () => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrainingPlan = async () => {
      try {
        const clientDni = localStorage.getItem('userDni');
        const token = localStorage.getItem('token');
        if (!clientDni) {
          throw new Error('No se encontró el DNI del cliente en el almacenamiento local');
        }

        const response = await fetch(`http://localhost:8080/api/v1/training-plans/clients/${clientDni}/active`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: TrainingPlan = await response.json();
        setTrainingPlan(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Ocurrió un error desconocido');
      } finally {
        setLoading(false);
      }
    };

    fetchTrainingPlan();
  }, []);

  // Organizar ejercicios por día
  const exercisesByDay: Record<string, ExerciseRoutine[]> = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: []
  };

  if (trainingPlan) {
    trainingPlan.exercises?.forEach(exercise => {
      if (exercisesByDay[exercise.day]) {
        exercisesByDay[exercise.day].push(exercise);
      }
    });
  }

  const dayNames: Record<string, string> = {
    MONDAY: 'Lunes',
    TUESDAY: 'Martes',
    WEDNESDAY: 'Miércoles',
    THURSDAY: 'Jueves',
    FRIDAY: 'Viernes',
    SATURDAY: 'Sábado',
    SUNDAY: 'Domingo'
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50">
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="mt-4 text-lg text-gray-600">Cargando plan de entrenamiento...</p>
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

  if (!trainingPlan) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h2 className="text-2xl font-bold text-gray-700 mb-4">No se encontró un plan de entrenamiento activo</h2>
        <p className="text-gray-600">Por favor aguarda, tu entrenador está creando tu entrenamiento personalizado para vos!.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-indigo-800 text-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">FITPOWER</h1>
          <div className="flex items-center space-x-3">
            <span className="font-medium">{trainingPlan.clientName}</span>
            <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
              {trainingPlan.clientName.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
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

      {/* Main Content */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {/* Plan Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-800 mb-1">{trainingPlan.name}</h2>
              <p className="text-gray-500">Creado el: {new Date(trainingPlan.createdAt).toLocaleDateString()}</p>
            </div>
            <div className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium inline-block">
              {trainingPlan.active ? 'Activo' : 'Inactivo'}
            </div>
            <button
              className="flex flex-col items-center justify-center p-4 bg-white border border-gray-400 rounded-lg hover:border-indigo-300 hover:shadow-md transition-all"
              onClick={() => navigate(`${trainingPlan.id}/records`)}
            >
              <div className="text-3xl mb-2">📝</div>
              <span className="text-sm font-medium text-center">Registrar entrenamiento</span>
            </button>
          </div>

          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-indigo-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-indigo-800 mb-2">Entrenador</h3>
              <p className="font-medium">{trainingPlan.trainerName}</p>
              <p className="text-sm text-gray-600 mt-1">Especialización: {trainingPlan.trainerSpecification}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">Tu Objetivo</h3>
              <p className="font-medium">{trainingPlan.clientGoal}</p>
            </div>
          </div>
        </div>

        {/* Weekly Plan */}
        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Rutina Semanal</h3>

          <div className="space-y-4">
            {Object.entries(exercisesByDay).map(([day, exercises]) => {
              if (exercises.length === 0) return null;

              return (
                <div key={day} className="bg-white rounded-lg shadow-sm overflow-hidden">
                  <div className="bg-gray-800 text-white px-4 py-3">
                    <h4 className="font-bold">{dayNames[day]}</h4>
                  </div>
                  <div className="divide-y divide-gray-100">
                    {exercises.map((exercise) => (
                      <div key={exercise.routineId} className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h5 className="font-bold text-gray-800">{exercise.exerciseName}</h5>
                            <div className="mt-2 grid grid-cols-3 gap-2 text-sm">
                              <div className="bg-gray-50 px-2 py-1 rounded">
                                <span className="text-gray-500">Series:</span> {exercise.series}
                              </div>
                              <div className="bg-gray-50 px-2 py-1 rounded">
                                <span className="text-gray-500">Reps:</span> {exercise.repetitions}
                              </div>
                              <div className="bg-gray-50 px-2 py-1 rounded">
                                <span className="text-gray-500">Peso:</span> {exercise.weight} kg
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Empty Days Message */}
        {Object.values(exercisesByDay).every(day => day.length === 0) && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  Tu plan de entrenamiento no tiene ejercicios asignados para ningún día. Por favor aguarda, tu entrenador está creando tu entrenamiento personalizado para vos!
                </p>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <FooterPag />
    </div>
  );
};

export default TrainingPlanPage;
