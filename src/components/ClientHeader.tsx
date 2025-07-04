import React, { useState } from "react";

interface ClientHeaderProps {
  fullName: string;
  onLogout: () => void;
}

export const ClientHeader: React.FC<ClientHeaderProps> = ({ fullName, onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getInitials = (name: string) => {
    if (!name || typeof name !== 'string') return "";
    const names = name.trim().split(" ");
    if (names.length === 0) return "";
    const firstNameInitial = names[0][0] || "";
    const lastNameInitial = names.length > 1 ? names[names.length - 1][0] : "";
    return `${firstNameInitial}${lastNameInitial}`.toUpperCase();
  };

  return (
    <header className="bg-indigo-800 text-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold">FITPOWER</h1>
        <div className="flex items-center space-x-4 relative">
          <span className="font-medium">{fullName || "Usuario"}</span>
          <div className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center font-bold">
            {getInitials(fullName)}
          </div>
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
    </header>
  );
};