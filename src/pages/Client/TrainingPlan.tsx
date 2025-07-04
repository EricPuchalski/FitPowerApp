import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FooterPag } from '../../components/Footer';
import { TrainingPlan } from '../../model/TrainingPlan';
import { ExerciseRoutine } from '../../model/ExerciseRoutine';
import { ClientHeader } from '../../components/ClientHeader';
import { useAuth } from '../../auth/hook/useAuth';

const TrainingPlanPage: React.FC = () => {
  const [trainingPlan, setTrainingPlan] = useState<TrainingPlan | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
    const { logout } = useAuth();
  


  const exercisesByDay: Record<string, ExerciseRoutine[]> = {
    MONDAY: [],
    TUESDAY: [],
    WEDNESDAY: [],
    THURSDAY: [],
    FRIDAY: [],
    SATURDAY: [],
    SUNDAY: []
  };

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

  if (trainingPlan) {
    trainingPlan.exerciseRoutines?.forEach(exercise => {
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

  const handleLogout = () => {
  logout();
  navigate("/");
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
        <p className="text-gray-600">Por favor aguarda, tu entrenador está creando tu entrenamiento personalizado para vos!</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <ClientHeader fullName={trainingPlan.clientName} onLogout={handleLogout}></ClientHeader>

      <nav className="bg-white shadow-sm">
        <ul className="container mx-auto px-4 flex">
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button onClick={() => navigate('/client')} className="w-full py-4 font-medium text-gray-600 hover:text-gray-900">
              Inicio
            </button>
          </li>
          <li className="flex-1 text-center border-b-4 border-red-500">
            <button className="w-full py-4 font-medium text-red-500">Plan de Entrenamiento</button>
          </li>
          <li className="flex-1 text-center hover:bg-gray-50 transition-colors">
            <button onClick={() => navigate('/client/nutrition-plan')} className="w-full py-4 font-medium text-gray-600 hover:text-gray-900">
              Plan de Nutrición
            </button>
          </li>
        </ul>
      </nav>

      <main className="flex-grow container mx-auto px-4 py-8">
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
        </div>

        <div className="mb-8">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Rutina Semanal</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(exercisesByDay).map(([day, exercises]) => (
              <div key={day} className="bg-white rounded-lg shadow-sm p-4">
                <h4 className="font-bold text-gray-800 mb-2">{dayNames[day]}</h4>
                {exercises.length > 0 ? (
                  <ul className="space-y-2">
                    {exercises.map((exercise) => (
                      <li key={exercise.routineId} className="border-b border-gray-200 pb-2">
                        <h5 className="font-medium text-gray-800">{exercise.exerciseName}</h5>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-1 text-sm">
                          <span>Series: {exercise.series}</span>
                          <span>Reps: {exercise.repetitions}</span>
                          <span>Peso: {exercise.weight} kg</span>
                          <span>Descanso: {exercise.restTime}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-gray-500">No hay ejercicios para este día.</p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end space-x-4">
          <button className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors">
            Descargar PDF
          </button>
        </div>
      </main>

      <FooterPag />
    </div>
  );
};

export default TrainingPlanPage;
