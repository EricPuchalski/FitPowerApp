"use client"

import { useState } from 'react'
import { Menu, X, Dumbbell, Users, Apple, ChevronRight, BarChart2, Calendar, Settings } from 'lucide-react'
import { FooterPag } from './Footer'

export default function DashboardAdmin() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Admin</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a href="#" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Apple size={18} />
              <span>Nutricionistas</span>
            </a>
            <a href="#" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="#" className="hover:text-blue-200 transition flex items-center space-x-1">
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
          {/* <Image
            src="/assets/dashboard.png"
            alt="Hombre musculoso con pesas"
            width={1200}
            height={800}
            className="w-full h-auto object-cover"
          /> */}
          <img width={1200}
            height={350} className="w-full h-[400px] object-cover" src="../../public/dashboard.png" alt="das"   />

          <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 to-indigo-900/80 flex items-center justify-center">
            <p className="text-white text-5xl font-bold text-center px-4 drop-shadow-lg">
              Transforma tu cuerpo,<br />transforma tu vida
            </p>
          </div>
        </div>

        <div className="mt-12 grid md:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-blue-800 hover:shadow-xl transition duration-300">
            <Dumbbell className="w-12 h-12 text-blue-800 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Programas de Entrenamiento</h2>
            <p className="text-gray-600">Diseña y gestiona programas personalizados para tus clientes.</p>
            {/* <a href="#" className="mt-4 inline-flex items-center text-blue-800 hover:text-blue-900">
              Explorar <ChevronRight size={20} />
            </a> */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-indigo-600 hover:shadow-xl transition duration-300">
            <Apple className="w-12 h-12 text-indigo-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Planes Nutricionales</h2>
            <p className="text-gray-600">Crea planes de alimentación adaptados a las necesidades de cada cliente.</p>
            {/* <a href="#" className="mt-4 inline-flex items-center text-indigo-600 hover:text-indigo-800">
              Explorar <ChevronRight size={20} />
            </a> */}
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-t-4 border-pink-600 hover:shadow-xl transition duration-300">
            <Users className="w-12 h-12 text-pink-600 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Gestión de Miembros</h2>
            <p className="text-gray-600">Administra fácilmente la información y progreso de tus clientes.</p>
            {/* <a href="#" className="mt-4 inline-flex items-center text-pink-600 hover:text-pink-800">
              Explorar <ChevronRight size={20} />
            </a> */}
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-2xl font-semibold mb-4">Resumen</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="flex items-center space-x-4 p-4 bg-blue-100 rounded-lg">
              <BarChart2 className="w-10 h-10 text-blue-600" />
              <div>
                <p className="text-sm text-blue-600">Total de Miembros</p>
                <p className="text-2xl font-bold text-blue-800">1,234</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-indigo-100 rounded-lg">
              <Calendar className="w-10 h-10 text-indigo-600" />
              <div>
                <p className="text-sm text-indigo-600">Clases Hoy</p>
                <p className="text-2xl font-bold text-indigo-800">15</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 bg-pink-100 rounded-lg">
              <Settings className="w-10 h-10 text-pink-600" />
              <div>
                <p className="text-sm text-pink-600">Equipos Activos</p>
                <p className="text-2xl font-bold text-pink-800">98%</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterPag></FooterPag>
    </div>
  )
}