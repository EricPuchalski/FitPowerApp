import { useState } from 'react'
import { Apple, Bell, Dumbbell, Menu, User, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'


export default function NavBarTrainer() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate();

  // Función para manejar la navegación
  const handleNavigation = (path: string) => {
    navigate(path);
  };

  return (
<header className="bg-gray-800 text-white">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Dumbbell className="w-8 h-8" />
            <h1 className="text-2xl font-bold">FitPower Entrenador</h1>
          </div>
          <nav className="hidden md:flex space-x-6">
        {/**    <a
              href="/trainer  "
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <User size={18} />
              <span>Perfil</span>
            </a>
*/} 
            <a
              href="/trainer/clients"
              className="hover:text-blue-200 transition flex items-center space-x-1"
            >
              <User size={18} />
              <span>Inicio</span>
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
