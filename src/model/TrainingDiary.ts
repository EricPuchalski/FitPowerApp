import { Session } from "./Session"

export type TrainingDiary = {
    id: number
    sessions: Session[]
    clientDni: string
    date: string
    observation: string
  } 