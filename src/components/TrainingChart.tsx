"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'
import { TrainingDiary } from '../model/TrainingDiary'
import { getTrainingDiaries } from '../services/TrainingDiaryService'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  BarElement
)

export default function TrainingChart() {
  const [data, setData] = useState<TrainingDiary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const clientId = '32423432'; // Reemplaza con el ID del cliente adecuado
        const result = await getTrainingDiaries(clientId, token);
        setData(result);
      } catch (error) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>


  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Training Diary Dashboard</CardTitle>
        <CardDescription>Comprehensive view of client's training sessions</CardDescription>
      </CardHeader>
      <CardContent>
        <RepsByExerciseChart data={data} />
        <WeightByExerciseChart data={data} />
        <TotalRepsBySessionChart data={data} />
        <TotalWeightBySessionChart data={data} />
        <ExercisesBySessionChart data={data} />
      </CardContent>
    </Card>
  )
}

function RepsByExerciseChart({ data }: { data: TrainingDiary[] }) {
  const chartData = {
    labels: data.flatMap(diary => diary.sessions.map(session => session.exerciseName)),
    datasets: [
      {
        label: 'Reps by Exercise',
        data: data.flatMap(diary => diary.sessions.map(session => session.reps)),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Bar data={chartData} />
    </div>
  )
}

function WeightByExerciseChart({ data }: { data: TrainingDiary[] }) {
  const chartData = {
    labels: data.flatMap(diary => diary.sessions.map(session => session.exerciseName)),
    datasets: [
      {
        label: 'Weight by Exercise',
        data: data.flatMap(diary => diary.sessions.map(session => session.weight)),
        backgroundColor: 'rgba(255,99,132,0.2)',
        borderColor: 'rgba(255,99,132,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Bar data={chartData} />
    </div>
  )
}

function TotalRepsBySessionChart({ data }: { data: TrainingDiary[] }) {
  const chartData = {
    labels: data.map(diary => new Date(diary.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Reps by Session',
        data: data.map(diary => diary.sessions.reduce((acc, session) => acc + session.reps, 0)),
        backgroundColor: 'rgba(54,162,235,0.2)',
        borderColor: 'rgba(54,162,235,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Bar data={chartData} />
    </div>
  )
}

function TotalWeightBySessionChart({ data }: { data: TrainingDiary[] }) {
  const chartData = {
    labels: data.map(diary => new Date(diary.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Total Weight by Session',
        data: data.map(diary => diary.sessions.reduce((acc, session) => acc + session.weight, 0)),
        backgroundColor: 'rgba(153,102,255,0.2)',
        borderColor: 'rgba(153,102,255,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Bar data={chartData} />
    </div>
  )
}

function ExercisesBySessionChart({ data }: { data: TrainingDiary[] }) {
  const chartData = {
    labels: data.map(diary => new Date(diary.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Exercises by Session',
        data: data.map(diary => diary.sessions.length),
        backgroundColor: 'rgba(255,159,64,0.2)',
        borderColor: 'rgba(255,159,64,1)',
        borderWidth: 1,
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Bar data={chartData} />
    </div>
  )
}
