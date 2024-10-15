import { Dumbbell } from "lucide-react";
import React from "react";
export const FooterPag = () => {
  return (
    <>
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 text-white">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-wrap justify-between">
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h3 className="text-xl font-semibold mb-2 flex items-center">
                <Dumbbell className="w-6 h-6 mr-2" />
                FitPower
              </h3>
              <p className="text-gray-400">
                Transformando vidas a través del fitness y la nutrición.
              </p>
            </div>
            <div className="w-full md:w-1/3 mb-6 md:mb-0">
              <h4 className="text-lg font-semibold mb-2">Enlaces Rápidos</h4>
              <ul className="space-y-2">
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Inicio
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Servicios
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-gray-400 hover:text-white transition"
                  >
                    Contacto
                  </a>
                </li>
              </ul>
            </div>
            <div className="w-full md:w-1/3">
              <h4 className="text-lg font-semibold mb-2">Contáctanos</h4>
              <p className="text-gray-400">Email: info@fitpower.com</p>
              <p className="text-gray-400">Teléfono: (123) 456-7890</p>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
            <p>&copy; 2024 FitPower. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </>
  );
};
