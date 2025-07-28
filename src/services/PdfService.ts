import { ExerciseRoutine } from "../model/ExerciseRoutine";
import { TrainingPlan } from "../model/TrainingPlan";

// src/services/pdfGenerator.service.ts
export const generateTrainingPlanPDF = (
  trainingPlan: TrainingPlan,
  exercisesByDay: Record<string, ExerciseRoutine[]>,
  dayNames: Record<string, string>
): void => {
  // Crear el contenido HTML para el PDF
  const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>${trainingPlan.name}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          color: #333;
          line-height: 1.6;
        }
        .header { 
          text-align: center; 
          margin-bottom: 30px; 
          border-bottom: 2px solid #3b82f6;
          padding-bottom: 20px;
        }
        .plan-title { 
          font-size: 28px; 
          font-weight: bold; 
          color: #1f2937;
          margin-bottom: 10px;
        }
        .plan-info { 
          color: #6b7280; 
          font-size: 14px;
        }
        .day-section { 
          margin-bottom: 25px; 
          page-break-inside: avoid;
        }
        .day-title { 
          font-size: 20px; 
          font-weight: bold; 
          color: #3b82f6;
          margin-bottom: 15px;
          padding: 10px;
          background-color: #f3f4f6;
          border-left: 4px solid #3b82f6;
        }
        .exercise { 
          margin-bottom: 15px; 
          padding: 12px;
          border: 1px solid #e5e7eb;
          border-radius: 8px;
          background-color: #fafafa;
        }
        .exercise-name { 
          font-weight: bold; 
          font-size: 16px;
          color: #1f2937;
          margin-bottom: 8px;
        }
        .exercise-details { 
          display: grid; 
          grid-template-columns: repeat(4, 1fr); 
          gap: 10px;
          font-size: 14px;
        }
        .detail-item {
          background-color: white;
          padding: 6px 8px;
          border-radius: 4px;
          border: 1px solid #e5e7eb;
        }
        .detail-label {
          font-weight: bold;
          color: #374151;
        }
        .no-exercises {
          color: #9ca3af;
          font-style: italic;
          text-align: center;
          padding: 20px;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 12px;
          color: #6b7280;
          border-top: 1px solid #e5e7eb;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <div class="plan-title">${trainingPlan.name}</div>
        <div class="plan-info">
          Cliente: ${trainingPlan.clientName}<br>
          Creado el: ${new Date(trainingPlan.createdAt).toLocaleDateString()}<br>
          Estado: ${trainingPlan.active ? "Activo" : "Inactivo"}
        </div>
      </div>
      
      ${Object.entries(exercisesByDay)
        .map(
          ([day, exercises]) => `
        <div class="day-section">
          <div class="day-title">${dayNames[day]}</div>
          ${
            exercises.length > 0
              ? exercises
                  .map(
                    (exercise) => `
              <div class="exercise">
                <div class="exercise-name">${exercise.exerciseName}</div>
                <div class="exercise-details">
                  <div class="detail-item">
                    <span class="detail-label">Series:</span> ${exercise.series}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Repeticiones:</span> ${exercise.repetitions}
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Peso:</span> ${exercise.weight} kg
                  </div>
                  <div class="detail-item">
                    <span class="detail-label">Descanso:</span> ${exercise.restTime}
                  </div>
                </div>
              </div>
            `
                  )
                  .join("")
              : '<div class="no-exercises">No hay ejercicios programados para este día</div>'
          }
        </div>
      `
        )
        .join("")}
    </body>
    </html>
  `;

  // Crear un blob con el contenido HTML
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);

  // Crear un enlace temporal para descargar
  const link = document.createElement("a");
  link.href = url;
  link.download = `plan-entrenamiento-${trainingPlan.name.replace(/\s+/g, "-").toLowerCase()}.html`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  // Limpiar la URL del objeto
  URL.revokeObjectURL(url);
};