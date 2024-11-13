export type TrainingPlan = {
    id: number;
    clientDni: string;
    active: boolean;
    name: string;
    description: string;
    routines: Routine[];
  };