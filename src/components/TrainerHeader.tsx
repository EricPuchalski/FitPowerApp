// src/components/TrainerHeader.tsx
import { Dumbbell, Home, Users, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface TrainerHeaderProps {
  onLogout: () => void;
}

export const TrainerHeader: React.FC<TrainerHeaderProps> = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleChangePassword = () => {
    navigate("/change-password");
  };

  return (
    <>
      <header className="bg-gradient-to-r from-blue-900 to-indigo-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Trainer</h1>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a href="/trainer/dashboard" className="hover:text-blue-200 flex items-center space-x-1">
                <Home size={18} />
                <span>Inicio</span>
              </a>
            </nav>
            <div className="relative hidden md:block">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center bg-blue-800 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm"
              >
                {isDropdownOpen ? "▲" : "▼"}
              </button>
              {isDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                  <button
                    onClick={handleChangePassword}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-200"
                  >
                    Cambiar contraseña
                  </button>
                  <button
                    onClick={onLogout}
                    className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-300"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
            <button
              className="md:hidden bg-blue-800 p-2 rounded"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden bg-indigo-800 text-white">
          <nav className="p-4 flex flex-col space-y-2">
            <a href="/trainer" className="hover:bg-indigo-700 p-2 rounded flex items-center space-x-2">
              <Home size={18}/>
              <span>Inicio</span>
            </a>
            <a href="/trainer/clients" className="hover:bg-indigo-700 p-2 rounded flex items-center space-x-2">
              <Users size={18}/>
              <span>Clientes</span>
            </a>
            <a href="/exercises" className="hover:bg-indigo-700 p-2 rounded flex items-center space-x-2">
              <Dumbbell size={18}/>
              <span>Ejercicios</span>
            </a>
            <button
              onClick={handleChangePassword}
              className="hover:bg-gray-600 p-2 rounded flex items-center space-x-2 text-left w-full"
            >
              <span>Cambiar contraseña</span>
            </button>
            <button
              onClick={onLogout}
              className="hover:bg-red-600 p-2 rounded flex items-center space-x-2 text-left w-full"
            >
              <span>Cerrar sesión</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
};
