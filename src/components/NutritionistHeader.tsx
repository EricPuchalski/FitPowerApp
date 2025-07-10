// src/components/NutritionistHeader.tsx
import { HeartPulse, Home, Users, Menu, X } from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

interface NutritionistHeaderProps {
  onLogout: () => void;
}

export const NutritionistHeader: React.FC<NutritionistHeaderProps> = ({ onLogout }) => {
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
      <header className="bg-gradient-to-r from-green-900 to-emerald-900 text-white shadow-lg">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <HeartPulse className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Nutritionist</h1>
          </div>

          <div className="flex items-center space-x-6">
            <nav className="hidden md:flex space-x-6">
              <a href="/nutritionist/dashboard" className="hover:text-green-200 flex items-center space-x-1">
                <Home size={18} />
                <span>Inicio</span>
              </a>
            </nav>
            <div className="relative hidden md:block">
              <button
                onClick={toggleDropdown}
                className="flex items-center justify-center bg-green-800 hover:bg-green-700 text-white px-3 py-1 rounded text-sm"
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
              className="md:hidden bg-green-800 p-2 rounded"
              onClick={toggleMenu}
            >
              {isMenuOpen ? <X size={24}/> : <Menu size={24}/>}
            </button>
          </div>
        </div>
      </header>
      {isMenuOpen && (
        <div className="md:hidden bg-emerald-800 text-white">
          <nav className="p-4 flex flex-col space-y-2">
            <a href="/nutritionist" className="hover:bg-emerald-700 p-2 rounded flex items-center space-x-2">
              <Home size={18}/>
              <span>Inicio</span>
            </a>
            <a href="/nutritionist/clients" className="hover:bg-emerald-700 p-2 rounded flex items-center space-x-2">
              <Users size={18}/>
              <span>Clientes</span>
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
