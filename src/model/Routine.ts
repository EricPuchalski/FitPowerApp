import { Session } from "./Session";

export type Routine = {
    id: number;
    name: string;
    completed: boolean;
    clientDni: string;
    sessions: Session[];
    active: boolean; // Añadido el campo active
    creationDate: Date;
  };