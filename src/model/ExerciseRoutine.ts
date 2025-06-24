// src/model/ExerciseRoutine.ts
export interface ExerciseRoutine {
  id?: number;               // Presente en ExerciseRoutineResponseDTO
  routineId: number;         // Presente en ambos DTOs (como Long en backend)
  exerciseId: number;        // Presente en ambos DTOs (como Long en backend)
  exerciseName: string;      // Presente en ambos DTOs
  series: number;            // Presente en ambos DTOs (como Integer en backend)
  repetitions: number;       // Presente en ambos DTOs (como Integer en backend)
  weight: number | null;     // Presente en ambos DTOs (puede ser null)
  day: string;               // Enum DayOfWeek en backend (puedes usar string o crear un enum)
  trainingPlanId?: number;   //
  // Presente en ExerciseRoutineResponseDTO
}
