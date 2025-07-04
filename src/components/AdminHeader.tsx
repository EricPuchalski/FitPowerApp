import { Apple, Dumbbell, Home, Users } from "lucide-react";
import React, { useState } from "react";

interface AdminHeaderProps {
  onLogout: () => void;
}

export const AdminHeader: React.FC<AdminHeaderProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-indigo-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">FITPOWER ADMIN</h1>

        <div className="flex items-center space-x-6">
          <nav className="hidden md:flex space-x-6">
            <a href="/admin" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Home size={18} />
              <span>Inicio</span>
            </a>
            <a href="/admin/nutritionists" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Apple size={18} />
              <span>Nutricionistas</span>
            </a>
            <a href="/admin/clients" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Users size={18} />
              <span>Clientes</span>
            </a>
            <a href="/admin/trainers" className="hover:text-blue-200 transition flex items-center space-x-1">
              <Dumbbell size={18} />
              <span>Entrenadores</span>
            </a>
          </nav>

          <div className="relative">
            <button
              onClick={toggleMenu}
              className="flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded text-sm"
            >
              {isMenuOpen ? "▲" : "▼"}
            </button>
            {isMenuOpen && (
              <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                <button
                  onClick={onLogout}
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-300"
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
