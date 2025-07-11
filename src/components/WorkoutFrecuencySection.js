import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Calendar, Target, Flame } from 'lucide-react';
// Componente mejorado para mostrar frecuencia de entrenamiento
export const WorkoutFrequencySection = ({ workoutFrequency }) => {
    if (!workoutFrequency)
        return null;
    const frequencyData = Object.entries(workoutFrequency)
        .sort(([a], [b]) => new Date(a) - new Date(b))
        .map(([date, count]) => {
        // Asegúrate de que la fecha se interpreta correctamente
        const d = new Date(date);
        // Formatea la fecha para que se muestre correctamente
        const formattedDate = d.toLocaleDateString('es-ES', {
            month: 'short',
            day: 'numeric',
            timeZone: 'UTC' // Asegúrate de que la zona horaria es consistente
        });
        return {
            date: formattedDate,
            entrenamientos: count
        };
    });
    const totalWorkouts = Object.values(workoutFrequency).reduce((sum, count) => sum + count, 0);
    const averagePerDay = totalWorkouts / Object.keys(workoutFrequency).length;
    return (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "text-center", children: [_jsxs("div", { className: "flex items-center justify-center gap-3 mb-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg", children: _jsx(Calendar, { className: "w-6 h-6 text-white" }) }), _jsx("h3", { className: "text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent", children: "Frecuencia de Entrenamiento" })] }), _jsx("p", { className: "text-gray-600", children: "Tu consistencia en el gimnasio" })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Target, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { className: "text-sm font-semibold text-blue-700", children: "ENTRENAMIENTOS TOTALES" })] }), _jsx("div", { className: "text-2xl font-bold text-blue-800", children: totalWorkouts })] }), _jsxs("div", { className: "bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Flame, { className: "w-5 h-5 text-green-600" }), _jsx("span", { className: "text-sm font-semibold text-green-700", children: "PROMEDIO DIARIO" })] }), _jsx("div", { className: "text-2xl font-bold text-green-800", children: averagePerDay.toFixed(1) })] }), _jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Calendar, { className: "w-5 h-5 text-purple-600" }), _jsx("span", { className: "text-sm font-semibold text-purple-700", children: "D\u00CDAS ACTIVOS" })] }), _jsx("div", { className: "text-2xl font-bold text-purple-800", children: Object.keys(workoutFrequency).length })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-lg", children: [_jsxs("h4", { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2", children: [_jsx(BarChart, { className: "w-5 h-5 text-green-500" }), "Entrenamientos por d\u00EDa"] }), _jsx("div", { className: "h-64", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(BarChart, { data: frequencyData, margin: { top: 20, right: 30, left: 20, bottom: 20 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "barGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#10b981", stopOpacity: 0.8 }), _jsx("stop", { offset: "95%", stopColor: "#059669", stopOpacity: 0.8 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9" }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12, fill: '#64748b' } }), _jsx(YAxis, { tick: { fontSize: 12, fill: '#64748b' } }), _jsx(Tooltip, { contentStyle: {
                                            borderRadius: '12px',
                                            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                                            border: 'none',
                                            backgroundColor: 'white'
                                        }, formatter: (value) => [`${value}`, 'Entrenamientos'] }), _jsx(Bar, { dataKey: "entrenamientos", fill: "url(#barGradient)", radius: [4, 4, 0, 0], name: "Entrenamientos" })] }) }) })] })] }));
};
