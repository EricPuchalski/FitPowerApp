import { Apple, Bell, Dumbbell, User } from 'lucide-react'
import React from 'react'

export const NavBarClient = () => {
  return (
    <header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Cliente</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
            <a
              href="/client"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <User size={18} />
              <span>Perfil</span>
            </a>

            <a
              href="/client/training"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <Dumbbell size={18} />
              <span>Entrenamiento</span>
            </a>
            <a
              href="/client/nutrition"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <Apple size={18} />
              <span>Nutrición</span>
            </a>
            <a
              href="#"
              className="hover:text-blue-200 transition flex items-center space-x-1 relative"
            >
              <Bell size={18} />

        
            </a>
          </nav>
          <button
            className="md:hidden bg-blue-800 p-2 rounded-md hover:bg-indigo-700 transition"
    
          >
          </button>
        </div>
      </header>
  )
}
