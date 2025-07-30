import React from "react";
import { ExerciseRoutine } from "../model/ExerciseRoutine";
import { Trash2, Edit2 } from "lucide-react";

const DAYS_LABELS = {
  MONDAY: "Lunes",
  TUESDAY: "Martes", 
  WEDNESDAY: "Miércoles",
  THURSDAY: "Jueves",
  FRIDAY: "Viernes",
  SATURDAY: "Sábado",
  SUNDAY: "Domingo",
};

export interface ExerciseListProps {
  exercises: ExerciseRoutine[];
  onEdit: (index: number) => void;
  onDelete: (index: number) => void;
  editingIndex?: number | null;
}

const ExerciseList: React.FC<ExerciseListProps> = ({ 
  exercises, 
  onEdit, 
  onDelete, 
  editingIndex 
}) => {
  if (exercises.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>No hay ejercicios agregados aún.</p>
        <p className="text-sm">
          Usa el formulario de la izquierda para agregar ejercicios.
        </p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
      <div className="bg-blue-50 rounded-t-lg p-4">
        <h2 className="text-lg font-semibold text-gray-900">
          Ejercicios del Plan ({exercises.length})
        </h2>
      </div>
      <div className="p-6">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ejercicio
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Día
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Series
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Reps
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Peso
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Descanso
                </th>
                <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {exercises.map((exercise, index) => {
                const dayLabel = DAYS_LABELS[exercise.dayOfWeek as keyof typeof DAYS_LABELS] || exercise.dayOfWeek;
                
                return (
                  <tr
                    key={index}
                    className={`${
                      index === editingIndex ? "bg-yellow-50" : ""
                    } hover:bg-gray-50`}
                  >
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-900">
                      <div className="font-medium">
                        {exercise.exerciseName || "Sin nombre"}
                      </div>
                    </td>
                    
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {dayLabel}
                    </td>
                    
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.series}
                    </td>
                    
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.repetitions}
                    </td>
                    
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {Number(exercise.weight) > 0 
                        ? `${exercise.weight} kg`
                        : "-"}
                    </td>
                    
                    <td className="px-3 py-4 whitespace-nowrap text-sm text-gray-500">
                      {exercise.restTime || "-"}
                    </td>
                    
                    <td className="px-3 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => onEdit(index)} 
                        className="text-blue-600 hover:text-blue-800 inline-flex items-center"
                        title="Editar ejercicio"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      
                      <button
                        onClick={() => onDelete(index)} 
                        className="text-red-600 hover:text-red-800 inline-flex items-center"
                        title="Eliminar ejercicio"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ExerciseList;