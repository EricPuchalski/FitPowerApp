import React from "react";
import { ExerciseRoutine } from "../model/ExerciseRoutine";

export interface ExerciseFormProps {
  exerciseId: number | string;
  series: number | string;
  repetitions: number | string;
  weight?: number | string;
  dayOfWeek: string;
  restTime?: string;
  exercises: { id: number; name: string }[];
  onChange: (field: keyof ExerciseRoutine, value: any) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  errors?: { [field: string]: string };
  isEdit?: boolean;
}

const daysOfWeek = [
  { value: "MONDAY", label: "Lunes" },
  { value: "TUESDAY", label: "Martes" },
  { value: "WEDNESDAY", label: "Miércoles" },
  { value: "THURSDAY", label: "Jueves" },
  { value: "FRIDAY", label: "Viernes" },
  { value: "SATURDAY", label: "Sábado" },
  { value: "SUNDAY", label: "Domingo" },
];

const ExerciseForm: React.FC<ExerciseFormProps> = ({
  exerciseId,
  series,
  repetitions,
  weight,
  dayOfWeek,
  restTime,
  exercises,
  onChange,
  onSubmit,
  onCancel,
  errors = {},
  isEdit = false,
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit();
  };

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-green-50 rounded-t-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          {isEdit ? "Editar Ejercicio" : "Agregar Ejercicio"}
        </h2>
      </div>
      <div className="p-6 space-y-4">
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Ejercicio *
              </label>
              <select
                value={exerciseId || ""}
                onChange={(e) => onChange("exerciseId", Number(e.target.value))}
                className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                <option value="" disabled>
                  — Selecciona ejercicio —
                </option>
                {exercises.map((ex) => (
                  <option key={ex.id} value={ex.id}>
                    {ex.name}
                  </option>
                ))}
              </select>
              {errors.exerciseId && (
                <p className="mt-1 text-sm text-red-600">{errors.exerciseId}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Día de la semana *
              </label>
              <select
                value={dayOfWeek}
                onChange={(e) => onChange("dayOfWeek", e.target.value)}
                className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              >
                {daysOfWeek.map((day) => (
                  <option key={day.value} value={day.value}>
                    {day.label}
                  </option>
                ))}
              </select>
              {errors.dayOfWeek && (
                <p className="mt-1 text-sm text-red-600">{errors.dayOfWeek}</p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Series *
                </label>
                <input
                  type="number"
                  value={series}
                  onChange={(e) => onChange("series", e.target.value)}
                  className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 3"
                  min="1"
                  required
                />
                {errors.series && (
                  <p className="mt-1 text-sm text-red-600">{errors.series}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Repeticiones *
                </label>
                <input
                  type="number"
                  value={repetitions}
                  onChange={(e) => onChange("repetitions", e.target.value)}
                  className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 10"
                  min="1"
                  required
                />
                {errors.repetitions && (
                  <p className="mt-1 text-sm text-red-600">{errors.repetitions}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Peso (kg)
                </label>
                <input
                  type="number"
                  value={weight || ""}
                  onChange={(e) => onChange("weight", e.target.value)}
                  className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: 20"
                  min="0"
                />
                {errors.weight && (
                  <p className="mt-1 text-sm text-red-600">{errors.weight}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descanso (MM:SS) *
                </label>
                <input
                  type="text"
                  value={restTime || ""}
                  onChange={(e) => onChange("restTime", e.target.value)}
                  className="border px-3 py-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="01:00"
                  pattern="^\d{2}:\d{2}$"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Formato: MM:SS (ej: 01:30 para 1 minuto 30 segundos)
                </p>
                {errors.restTime && (
                  <p className="mt-1 text-sm text-red-600">{errors.restTime}</p>
                )}
              </div>
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md flex items-center space-x-2 flex-1 justify-center"
              >
                <span>{isEdit ? "Actualizar Ejercicio" : "Agregar Ejercicio"}</span>
              </button>
              
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md"
                >
                  Cancelar
                </button>
              )}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ExerciseForm;