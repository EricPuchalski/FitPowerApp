"use client";

import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { ArrowLeft, Plus, Trash2, Save, Edit2 } from "lucide-react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useAuth } from "../../auth/hook/useAuth";
import { FooterPag } from "../../components/Footer";
import { TrainerHeader } from "../../components/TrainerHeader";
import ErrorMessage from "../../components/ErrorMessage";
import ExerciseForm from "../../components/ExerciseForm";
import ExerciseList from "../../components/ExerciseList";
import PlanHeaderActions from "../../components/PlanHeaderActions";
import TrainingPlanDetailsForm from "../../components/TrainingPlanDetailsForm";
import { fetchExercises } from "../../services/ExerciseService";
import { createTrainingPlan, deleteExerciseRoutine, fetchExerciseRoutines, fetchTrainingPlan, saveExerciseRoutine } from "../../services/TrainingPlanService";

interface SimpleExercise {
  id: number;
  name: string;
}

interface Exercise {
  id?: number;
  exerciseId: number;
  exerciseName: string;
  series: string | number;
  repetitions: string | number;
  weight: string | number;
  dayOfWeek: string;
  restTime: string;
}

interface TrainingPlan {
  id?: number;
  name: string;
  description: string;
  startDate: string;
  endDate: string;
  clientDni: string;
  exercises: Exercise[];
}

export default function TrainingPlanEdit() {
  const { clientDni, planId } = useParams<{
    clientDni: string;
    planId: string;
  }>();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [allExercises, setAllExercises] = useState<SimpleExercise[]>([]);
  const [plan, setPlan] = useState<TrainingPlan>({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    clientDni: clientDni || "",
    exercises: [],
  });

  const [authError, setAuthError] = useState<string | null>(null);
  const [exerciseForm, setExerciseForm] = useState<Exercise>({
    exerciseId: 0,
    exerciseName: "",
    series: "3",
    repetitions: "10",
    weight: "0",
    dayOfWeek: "MONDAY",
    restTime: "01:00",
  });
  const [isEditingExercise, setIsEditingExercise] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const { logout } = useAuth();
  const isNewPlan = planId === "new";

  const clearExerciseForm = () => {
    setExerciseForm({
      exerciseId: 0,
      exerciseName: "",
      series: "3",
      repetitions: "10",
      weight: "0",
      dayOfWeek: "MONDAY",
      restTime: "01:00",
    });
    setIsEditingExercise(false);
    setEditingIndex(null);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      setAuthError("No se encontró token de autenticación");
      return;
    }

    const loadData = async () => {
      try {
        // Cargar catálogo de ejercicios
        const exercisesData = await fetchExercises(token);
        setAllExercises(exercisesData);

        if (isNewPlan) {
          setPlan({
            name: "",
            description: "",
            startDate: new Date().toISOString().split("T")[0],
            endDate: "",
            clientDni: clientDni || "",
            exercises: [],
          });
          setLoading(false);
        } else {
          await loadTrainingPlan(exercisesData, token);
        }
      } catch (error) {
        console.error("Error al cargar datos:", error);
        toast.error("Error al cargar datos. Por favor intenta nuevamente.");
        setAuthError("Error al cargar datos. Por favor intenta nuevamente.");
      }
    };

    loadData();
  }, [planId, isNewPlan, clientDni]);

  const loadTrainingPlan = async (exerciseCatalog: SimpleExercise[], token: string) => {
    try {
      setLoading(true);
      
      const [planData, exercisesData] = await Promise.all([
        fetchTrainingPlan(clientDni!, planId!, token),
        fetchExerciseRoutines(clientDni!, planId!, token)
      ]);

      const exercises = exercisesData.map((ex: any) => {
        const match = exerciseCatalog.find(
          (e) => e.id === ex.exerciseId || e.id === ex.exercise?.id
        );

        return {
          id: ex.id,
          exerciseId: ex.exerciseId || ex.exercise?.id || 0,
          exerciseName: match?.name || "Sin nombre",
          series: ex.series.toString(),
          repetitions: ex.repetitions.toString(),
          weight: ex.weight.toString(),
          restTime: ex.restTime,
          dayOfWeek: ex.day,
        };
      });

      setPlan({
        id: planData.id,
        name: planData.name,
        description: planData.description,
        startDate: planData.startDate,
        endDate: planData.endDate,
        clientDni: clientDni || "",
        exercises: exercises,
      });

      toast.success("Plan de entrenamiento cargado correctamente");
    } catch (error) {
      console.error("Error fetching training plan:", error);
      toast.error("Error al cargar el plan de entrenamiento");
      setAuthError("Ocurrió un error al cargar el plan. Por favor intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseForm = (field: keyof Exercise, value: any) => {
    setExerciseForm((prev) => {
      if (field === "exerciseId") {
        const selectedExercise = allExercises.find(
          (ex) => ex.id === Number(value)
        );
        return {
          ...prev,
          exerciseId: Number(value),
          exerciseName: selectedExercise?.name || "",
        };
      }
      return { ...prev, [field]: value };
    });
  };

  const validateExercise = (exercise: Exercise): boolean => {
    const series = Number(exercise.series);
    const repetitions = Number(exercise.repetitions);
    const weight = Number(exercise.weight);

    if (exercise.exerciseId <= 0) {
      toast.error("Por favor selecciona un ejercicio válido");
      return false;
    }
    if (isNaN(series) || series <= 0) {
      toast.error("El número de series debe ser mayor a 0");
      return false;
    }
    if (isNaN(repetitions) || repetitions <= 0) {
      toast.error("El número de repeticiones debe ser mayor a 0");
      return false;
    }
    if (isNaN(weight) || weight < 0) {
      toast.error("El peso debe ser un número válido");
      return false;
    }
    if (!/^\d{2}:\d{2}$/.test(exercise.restTime)) {
      toast.error("El formato del tiempo de descanso debe ser MM:SS");
      return false;
    }
    return true;
  };

  const addOrUpdateExercise = async () => {
    if (!validateExercise(exerciseForm)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No se encontró token de autenticación");
        return;
      }

      const exerciseToSave = {
        ...exerciseForm,
        series: Number(exerciseForm.series),
        repetitions: Number(exerciseForm.repetitions),
        weight: Number(exerciseForm.weight),
      };

      if (isEditingExercise && editingIndex !== null) {
        let updatedExercise;
        
        if (exerciseForm.id && !isNewPlan) {
          updatedExercise = await saveExerciseRoutine(
            clientDni!,
            planId!,
            exerciseToSave,
            token,
            true
          );
        }

        setPlan((prev) => ({
          ...prev,
          exercises: prev.exercises.map((exercise, index) =>
            index === editingIndex
              ? { ...exercise, ...(updatedExercise || exerciseToSave) }
              : exercise
          ),
        }));

        toast.success("Ejercicio actualizado correctamente");
      } else {
        let newExercise = { ...exerciseToSave };

        if (!isNewPlan) {
          const createdExercise = await saveExerciseRoutine(
            clientDni!,
            planId!,
            exerciseToSave,
            token
          );
          newExercise = { ...newExercise, id: createdExercise.id };
        }

        setPlan((prev) => ({
          ...prev,
          exercises: [...prev.exercises, newExercise],
        }));
        toast.success("Ejercicio agregado correctamente");
      }

      clearExerciseForm();
    } catch (error) {
      console.error("Error al guardar ejercicio:", error);
      toast.error("Error al guardar el ejercicio. Por favor intenta nuevamente.");
    }
  };

  const editExercise = (index: number) => {
    const exercise = plan.exercises[index];
    setExerciseForm({
      ...exercise,
      series: exercise.series.toString(),
      repetitions: exercise.repetitions.toString(),
      weight: exercise.weight.toString(),
    });
    setIsEditingExercise(true);
    setEditingIndex(index);
  };

  const confirmDeleteExercise = (exerciseIndex: number) => {
    const exercise = plan.exercises[exerciseIndex];
    const exerciseName = exercise.exerciseName || "este ejercicio";

    toast.info(
      <div>
        <p>¿Seguro que deseas eliminar "{exerciseName}"?</p>
        <div className="flex justify-end space-x-2 mt-2">
          <button
            onClick={() => {
              toast.dismiss();
              removeExercise(exerciseIndex);
            }}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Eliminar
          </button>
          <button
            onClick={() => toast.dismiss()}
            className="px-3 py-1 bg-gray-300 text-gray-700 rounded hover:bg-gray-400"
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

  const removeExercise = async (exerciseIndex: number) => {
    const exercise = plan.exercises[exerciseIndex];

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("No se encontró token de autenticación");
        return;
      }

      if (exercise.id && !isNewPlan) {
        await deleteExerciseRoutine(
          clientDni!,
          planId!,
          exercise.id,
          token
        );
      }

      setPlan((prev) => ({
        ...prev,
        exercises: prev.exercises.filter((_, index) => index !== exerciseIndex),
      }));

      if (isEditingExercise && editingIndex === exerciseIndex) {
        clearExerciseForm();
      }

      toast.success("Ejercicio eliminado correctamente");
    } catch (error) {
      console.error("Error al eliminar ejercicio:", error);
      toast.error("Error al eliminar el ejercicio. Por favor intenta nuevamente.");
    }
  };

  const savePlan = async () => {
    setSaving(true);
    setAuthError(null);

    if (!plan.name) {
      toast.error("Por favor completa el nombre del plan");
      setSaving(false);
      return;
    }

    if (plan.exercises.length === 0) {
      toast.error("Debes agregar al menos un ejercicio al plan");
      setSaving(false);
      return;
    }

    for (const ex of plan.exercises) {
      if (!validateExercise(ex)) {
        setSaving(false);
        return;
      }
    }

    const token = localStorage.getItem("token");
    const trainerIdStr = localStorage.getItem("trainerId");

    if (!token) {
      toast.error("No se encontró token de autenticación");
      setAuthError("No se encontró token de autenticación. Por favor inicie sesión nuevamente.");
      setSaving(false);
      return;
    }

    if (!trainerIdStr) {
      toast.error("No se encontró el ID del entrenador");
      setSaving(false);
      return;
    }

    const trainerId = Number(trainerIdStr);
    if (isNaN(trainerId)) {
      toast.error("El ID del entrenador no es válido");
      setSaving(false);
      return;
    }

    try {
      toast.info("Guardando plan de entrenamiento...");

      if (isNewPlan) {
        const createdPlan = await createTrainingPlan(
          clientDni!,
          {
            name: plan.name.trim(),
            description: plan.description,
            startDate: plan.startDate,
            endDate: plan.endDate,
          },
          token
        );

        // Guardar ejercicios para el nuevo plan
        for (const ex of plan.exercises) {
          await saveExerciseRoutine(
            clientDni!,
            createdPlan.id.toString(),
            {
              ...ex,
              series: Number(ex.series),
              repetitions: Number(ex.repetitions),
              weight: Number(ex.weight),
            },
            token
          );
        }
      } else {
        // Actualizar ejercicios para plan existente
        for (const ex of plan.exercises) {
          await saveExerciseRoutine(
            clientDni!,
            planId!,
            {
              ...ex,
              series: Number(ex.series),
              repetitions: Number(ex.repetitions),
              weight: Number(ex.weight),
            },
            token,
            !!ex.id
          );
        }
      }

      toast.success("Plan de entrenamiento guardado correctamente");
      navigate(`/trainer/client/${clientDni}/training-plans/`);
    } catch (err) {
      console.error("Error completo:", err);
      toast.error("Error al guardar el plan. Por favor intenta nuevamente.");
      setAuthError("Error al guardar el plan. Por favor verifica tus permisos e intenta nuevamente.");
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
          <div className="space-y-4">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
            <div className="h-48 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  if (authError) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-8">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg
                className="h-5 w-5 text-red-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{authError}</p>
              <div className="mt-4">
                <Link
                  to="/"
                  className="text-sm font-medium text-red-700 hover:text-red-600"
                >
                  Volver a iniciar sesión <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </div>
    );
  }

  return (
    <>
      <TrainerHeader onLogout={handleLogout} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PlanHeaderActions
          title={isNewPlan ? "Crear Plan de Entrenamiento" : "Editar Plan de Entrenamiento"}
          onSave={savePlan}
          onBack={() => navigate(`/trainer/client/${clientDni}/training-plans`)}
          isSaving={saving}
          isNewPlan={isNewPlan}
          isEditingExercise={isEditingExercise}
        />

        {authError && <ErrorMessage message={authError} severity="error" />}

        <TrainingPlanDetailsForm
          name={plan.name}
          onChange={(e) => setPlan(prev => ({ ...prev, name: e.target.value }))}
          disabled={!isNewPlan}
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
          <ExerciseForm
            exerciseId={exerciseForm.exerciseId}
            series={exerciseForm.series}
            repetitions={exerciseForm.repetitions}
            weight={exerciseForm.weight}
            dayOfWeek={exerciseForm.dayOfWeek}
            restTime={exerciseForm.restTime}
            exercises={allExercises}
            onChange={updateExerciseForm}
            onSubmit={addOrUpdateExercise}
            onCancel={isEditingExercise ? clearExerciseForm : undefined}
            isEdit={isEditingExercise}
          />

          <ExerciseList
            exercises={plan.exercises}
            onEdit={editExercise}
            onDelete={confirmDeleteExercise}
            editingIndex={editingIndex}
          />
        </div>
      </div>
      <FooterPag />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}