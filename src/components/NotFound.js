import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useNavigate } from 'react-router-dom';
import notFoundImage from '../assets/404.png'; // Ajusta la ruta según la ubicación de tu imagen
const NotFound = () => {
    const navigate = useNavigate();
    return (_jsx("div", { className: "min-h-screen bg-black flex items-center justify-center px-4", children: _jsxs("div", { className: "text-center", children: [_jsx("div", { className: "mb-8", children: _jsx("img", { src: notFoundImage, alt: "P\u00E1gina no encontrada", className: "mx-auto max-w-md w-full h-auto drop-shadow-2xl" }) }), _jsx("p", { className: "text-gray-300 text-xl mb-8 max-w-lg mx-auto font-medium", children: "Parece que la p\u00E1gina que buscas no existe o ha sido movida. \u00A1Pero no te preocupes! Puedes volver al inicio y seguir entrenando." }), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx("button", { onClick: () => navigate(-1), className: "bg-white hover:bg-gray-200 text-black font-bold py-3 px-8 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg", children: "Volver al Inicio" }), _jsx("a", { href: "/contacto", className: "border-2 border-white text-white hover:bg-white hover:text-black font-bold py-3 px-8 rounded-lg transition-all duration-300", children: "Cont\u00E1ctanos" })] }), _jsx("div", { className: "mt-12 text-gray-400", children: _jsx("p", { className: "text-sm", children: "\u00BFNecesitas ayuda? Cont\u00E1ctanos y te ayudaremos a encontrar lo que buscas." }) })] }) }));
};
export default NotFound;
