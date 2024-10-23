import { useState } from 'react'
import { Menu, X } from 'lucide-react'


export default function NavBarTrainer() {
  const [isOpen, setIsOpen] = useState(false)


  // Función para manejar la navegación
  const handleNavigation = (path: string) => {

    setIsOpen(false) // Cerrar el menú después de la navegación
  }

  return (
    <nav className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <span className="font-bold text-xl">Dashboard Entrenador</span>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              <button
                onClick={() => handleNavigation('/gestionar-rutinas')}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              >
                Gestionar rutinas
              </button>
              <button
                onClick={() => handleNavigation('/gestionar-clientes')}
                className="px-3 py-2 rounded-md text-sm font-medium hover:bg-gray-700 hover:text-white"
              >
                Gestionar clientes
              </button>
            </div>
          </div>
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white"
            >
              <span className="sr-only">Abrir menú principal</span>
              {isOpen ? <X className="block h-6 w-6" /> : <Menu className="block h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <button
              onClick={() => handleNavigation('/gestionar-rutinas')}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Gestionar rutinas
            </button>
            <button
              onClick={() => handleNavigation('/gestionar-clientes')}
              className="block px-3 py-2 rounded-md text-base font-medium hover:bg-gray-700 hover:text-white"
            >
              Gestionar clientes
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
