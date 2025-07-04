import { useNavigate } from 'react-router-dom';
import notFoundImage from '../assets/404.png'; // Ajusta la ruta según la ubicación de tu imagen

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <div className="text-center">
        {/* Imagen 404 */}
        <div className="mb-8">
          <img 
            src={notFoundImage} 
            alt="Página no encontrada" 
            className="mx-auto max-w-md w-full h-auto drop-shadow-2xl"
          />
        </div>
        
        {/* Descripción */}
        <p className="text-gray-300 text-xl mb-8 max-w-lg mx-auto font-medium">
          Parece que la página que buscas no existe o ha sido movida. 
          ¡Pero no te preocupes! Puedes volver al inicio y seguir entrenando.
        </p>
        
        {/* Botones de acción */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button 
            onClick={()=> navigate(-1)}
            className="bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg"
          >
            Volver al Inicio
          </button>
          
          <a 
            href="/contacto" 
            className="border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-8 rounded-lg transition-all duration-300"
          >
            Contáctanos
          </a>
        </div>
        
        {/* Mensaje adicional */}
        <div className="mt-12 text-gray-400">
          <p className="text-sm">
            ¿Necesitas ayuda? Contáctanos y te ayudaremos a encontrar lo que buscas.
          </p>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
