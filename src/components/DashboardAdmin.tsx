"use client"
import { useEffect } from 'react'
import { useState } from 'react'
import { Menu, X, Dumbbell, Users, Apple, ChevronRight, BarChart2, Calendar, Settings, Home } from 'lucide-react'
import { FooterPag } from './Footer'
import { FaUsers, FaClipboardList, FaAppleAlt } from 'react-icons/fa';

export default function DashboardAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [datos, setDatos] = useState([]);
  const token = localStorage.getItem("token");
  const [totalClients, setTotalClients] = useState(0);
  const [totalNutritionists, setTotalNutritionists] = useState(0);
  const [totalTrainers, setTotalTrainers] = useState(0);

  useEffect(() => {
    fetch('http://localhost:8080/api/clients', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setDatos(data));

    fetch('http://localhost:8080/totalClients')
      .then(response => response.json())
      .then(data => setTotalClients(data));

    fetch('http://localhost:8080/totalNutritionists')
      .then(response => response.json())
      .then(data => setTotalNutritionists(data));

    fetch('http://localhost:8080/totalTrainers')
      .then(response => response.json())
      .then(data => setTotalTrainers(data));
     
  }, []);
  console.log(datos);

  

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Admin</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
                        <a href="/admin" className="hover:text-blue-200 transition flex items-center space-x-1">
  <Home size={18} />
  <span>Inicio</span>
</a>
            <a href="admin/nutritionists" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Apple size={18} />
              <span>Nutricionistas</span>
            </a>
            <a href="admin/clients" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="admin/trainers" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Dumbbell size={18} />
              <span>Entrenadores</span>
            </a>
          </nav>
          <button 
            className="md:hidden bg-blue-800 p-2 rounded-md hover:bg-indigo-700 transition"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </header>

      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 text-white">
          <nav className="container mx-auto px-4 py-2 flex flex-col space-y-2">
            <a href="#" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
              <Apple size={18} />
              <span>Nutricionistas</span>
            </a>
            <a href="#" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="#" className="hover:bg-indigo-700 py-2 px-4 rounded transition flex items-center space-x-2">
              <Dumbbell size={18} />
              <span>Entrenadores</span>
            </a>
          </nav>
        </div>
      )}
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="relative rounded-lg overflow-hidden shadow-2xl">
          <img width={1200}
            height={350} className="w-full h-[400px] object-cover" src="../../public/dashboard.png" alt="das"   />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 flex items-center justify-center">
            <p className="text-white text-5xl font-bold text-center px-4 drop-shadow-lg">
              Transforma tu cuerpo,<br />transforma tu vida
            </p>
          </div>
        </div>

    

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
          <div className="grid md:grid-cols-3 gap-6">
          <div className="flex items-center space-x-4 p-4 bg-blue-100 rounded-lg">
  <FaUsers className="w-10 h-10 text-blue-600" />
  <div>
    <p className="text-sm text-blue-600">Total de Clientes</p>
    <p className="text-2xl font-bold text-blue-800">
      {totalClients}
    </p>
  </div>
</div>
<div className="flex items-center space-x-4 p-4 bg-indigo-100 rounded-lg">
  <FaClipboardList className="w-10 h-10 text-indigo-600" />
  <div>
    <p className="text-sm text-indigo-600">Total de Entrenadores</p>
    <p className="text-2xl font-bold text-indigo-800">{totalTrainers}</p>
  </div>
</div>
<div className="flex items-center space-x-4 p-4 bg-pink-100 rounded-lg">
  <FaAppleAlt className="w-10 h-10 text-pink-600" />
  <div>
    <p className="text-sm text-pink-600">Total de Nutricionistas</p>
    <p className="text-2xl font-bold text-pink-800">{totalNutritionists}</p>
  </div>
</div>
          </div>
        </div>
      </main>
      <FooterPag></FooterPag>
    </div>
  )
}