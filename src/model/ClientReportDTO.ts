export interface ClientReportDTO {
  trainingPlanName: string;
  clientName: string;
  clientDni: string;
  clientGoals: string;
  trainerName: string;
  period: string;
  trainedDays: number;
  attendanceRate: string;
  trainedDates: string[];
  strengthProgress: {
    exerciseName: string;
    progress: string;
  };
  exerciseProgressDetails: Array<{
    exercise: string;
    initial: string;
    finalValue: string;
    progress: string;
    initialReps: number;
    finalReps: number;
  }>;
  restTimeAnalysis: string;
  trainerComment: string;
  nextSteps: string;
}