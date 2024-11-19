"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Line, Bar } from 'react-chartjs-2'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, BarElement } from 'chart.js'
import TrainingChart from './TrainingChart'
import NavBarTrainer from './NavBarTrainer'
import { ClientStats } from '../model/ClientStatus'

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

function calculateBMI(weight: number, height: number): number {
  return weight / ((height / 100) ** 2)
}

export default function ClientPhysicalStatusAdvancedDashboard() {
  const [data, setData] = useState<ClientStats[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedDate, setSelectedDate] = useState<string | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await fetch('http://localhost:8080/api/clients/32423432/statuses', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        const result = await response.json()
        setData(result)
      } catch (error) {
        setError('Error fetching data')
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  const filteredData = selectedDate
    ? data.filter(entry => entry.creationDate === selectedDate)
    : data

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
      <NavBarTrainer />
      <Card className="flex-grow w-full">
        <CardHeader>
          <CardTitle>Client Physical Status Advanced Dashboard</CardTitle>
          <CardDescription>Comprehensive and diverse view of client's physical measurements over time</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="mb-4">
            <label htmlFor="date-select">Select Date:</label>
            <select id="date-select" onChange={(e) => setSelectedDate(e.target.value)}>
              <option value="">All Dates</option>
              {data.map(entry => (
                <option key={entry.creationDate} value={entry.creationDate}>
                  {new Date(entry.creationDate).toLocaleDateString()}
                </option>
              ))}
            </select>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <WeightTrendChart data={filteredData} />
            <MuscleMassTrendChart data={filteredData} />
            <BodyFatTrendChart data={filteredData} />
            <MuscleFatComparisonChart data={filteredData} />
            <HeightTrendChart data={filteredData} />
            <BMITrendChart data={filteredData} />
          </div>
          <TrainingChart />
        </CardContent>
      </Card>
    </div>
  )
}

function WeightTrendChart({ data }: { data: ClientStats[] }) {
  const chartData = {
    labels: data.map(entry => new Date(entry.creationDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Weight (kg)',
        data: data.map(entry => entry.weight),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Line data={chartData} />
    </div>
  )
}

function MuscleMassTrendChart({ data }: { data: ClientStats[] }) {
  const chartData = {
    labels: data.map(entry => new Date(entry.creationDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Muscle Mass (kg)',
        data: data.map(entry => entry.bodymass),
        fill: false,
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Line data={chartData} />
    </div>
  )
}

function BodyFatTrendChart({ data }: { data: ClientStats[] }) {
  const chartData = {
    labels: data.map(entry => new Date(entry.creationDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Body Fat (%)',
        data: data.map(entry => entry.bodyfat),
        fill: false,
        backgroundColor: 'rgba(255,99,132,0.4)',
        borderColor: 'rgba(255,99,132,1)',
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Line data={chartData} />
    </div>
  )
}

function MuscleFatComparisonChart({ data }: { data: ClientStats[] }) {
  const chartData = {
    labels: data.map(entry => new Date(entry.creationDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Muscle Mass (kg)',
        data: data.map(entry => entry.bodymass),
        backgroundColor: 'rgba(75,192,192,0.2)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
      {
        label: 'Body Fat (%)',
        data: data.map(entry => entry.bodyfat),
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

function HeightTrendChart({ data }: { data: ClientStats[] }) {
  const chartData = {
    labels: data.map(entry => new Date(entry.creationDate).toLocaleDateString()),
    datasets: [
      {
        label: 'Height (cm)',
        data: data.map(entry => entry.height),
        fill: false,
        backgroundColor: 'rgba(54,162,235,0.4)',
        borderColor: 'rgba(54,162,235,1)',
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Line data={chartData} />
    </div>
  )
}

function BMITrendChart({ data }: { data: ClientStats[] }) {
  const chartData = {
    labels: data.map(entry => new Date(entry.creationDate).toLocaleDateString()),
    datasets: [
      {
        label: 'BMI',
        data: data.map(entry => calculateBMI(entry.weight, entry.height)),
        fill: false,
        backgroundColor: 'rgba(153,102,255,0.4)',
        borderColor: 'rgba(153,102,255,1)',
      },
    ],
  }

  return (
    <div className="h-[400px] mb-4">
      <Line data={chartData} />
    </div>
  )
}
