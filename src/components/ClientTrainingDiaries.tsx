import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { FooterPag } from './Footer'
import NavBarTrainer from './NavBarTrainer'
import { TrainingDiary } from '../model/TrainingDiary'


export default function ClientTrainingDiaries() {
  const [trainingDiaries, setTrainingDiaries] = useState<TrainingDiary[]>([])
  const [filteredDiaries, setFilteredDiaries] = useState<TrainingDiary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchDate, setSearchDate] = useState('')
  const { clientDni } = useParams<{ clientDni: string }>()
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetchTrainingDiaries = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/training-diaries/client/${clientDni}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        })
        setTrainingDiaries(response.data)
        setFilteredDiaries(response.data)
        setLoading(false)
      } catch (err) {
        setError('Error al cargar los diarios de entrenamiento')
        setLoading(false)
      }
    }

    fetchTrainingDiaries()
  }, [clientDni, token])

  const handleSearch = () => {
    if (searchDate) {
      const filtered = trainingDiaries.filter(diary => {
        const diaryDate = new Date(diary.date).toISOString().split('T')[0]
        const searchDateISO = new Date(searchDate).toISOString().split('T')[0]
        return diaryDate === searchDateISO
      })
      setFilteredDiaries(filtered)
    } else {
      setFilteredDiaries(trainingDiaries)
    }
  }

  if (loading) return <div className="text-center mt-8">Cargando...</div>
  if (error) return <div className="text-center mt-8 text-red-500">{error}</div>

  return (
    <div className="flex flex-col min-h-screen">
      <NavBarTrainer />
      <div className="flex-grow container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Historial de Entrenamiento - Cliente DNI: {clientDni}</h1>
        <div className="mb-4 flex flex-col items-center">
          <label htmlFor="searchDate" className="text-gray-700 mb-2">Buscar por fecha:</label>
          <div className="flex items-center">
            <input
              type="date"
              id="searchDate"
              value={searchDate}
              onChange={(e) => setSearchDate(e.target.value)}
              className="border border-gray-300 rounded-l-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              onClick={handleSearch}
              className="bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Buscar
            </button>
          </div>
        </div>
        {filteredDiaries.length === 0 ? (
          <p className="text-center text-gray-600">No hay diarios de entrenamiento para esta fecha.</p>
        ) : (
          filteredDiaries.map((diary) => (
            <div key={diary.id} className="bg-white shadow-lg rounded-lg p-6 mb-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Entrenamiento del {new Date(diary.date).toLocaleDateString()}
              </h2>
              <p className="mb-4 text-gray-700"><strong>Observación:</strong> {diary.observation}</p>
              <h3 className="text-lg font-semibold mb-2 text-gray-800">Sesiones:</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-200">
                  <thead className="bg-gray-100">
                    <tr>
                      <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">Ejercicio</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">Repeticiones</th>
                      <th className="py-2 px-4 border-b border-gray-200 text-left text-gray-700">Peso (kg)</th>
                    </tr>
                  </thead>
                  <tbody>
                    {diary.sessions.map((session) => (
                      <tr key={session.id} className="border-b border-gray-200">
                        <td className="py-2 px-4 text-gray-800">{session.exerciseName}</td>
                        <td className="py-2 px-4 text-gray-800">{session.reps}</td>
                        <td className="py-2 px-4 text-gray-800">{session.weight}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          ))
        )}
      </div>
      <FooterPag />
    </div>
  )
}
