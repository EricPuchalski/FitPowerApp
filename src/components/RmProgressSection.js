import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Info, ChevronDown, Zap } from 'lucide-react';
export const RmProgressSection = ({ data }) => {
    const [selectedExercise, setSelectedExercise] = useState(data ? Object.keys(data.currentMaxRms)[0] : '');
    if (!data)
        return null;
    // Formatear datos para el gráfico
    const chartData = data.rmByExercise[selectedExercise].map(item => ({
        date: new Date(item.date).toLocaleDateString('es-ES', { month: 'short', day: 'numeric' }),
        rm: item.estimated1RM,
        peso: item.weightUsed,
        reps: item.repetitions
    }));
    // Calcular mejora desde el primer registro
    const firstRM = chartData[0]?.rm || 0;
    const currentRM = data.currentMaxRms[selectedExercise];
    const improvement = firstRM > 0 ? ((currentRM - firstRM) / firstRM) * 100 : 0;
    return (_jsxs("div", { className: "space-y-8", children: [_jsx("div", { className: "text-center", children: _jsxs("div", { className: "flex items-center justify-center gap-3 mb-3", children: [_jsx("div", { className: "p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg", children: _jsx(Zap, { className: "w-6 h-6 text-white" }) }), _jsx("h3", { className: "text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent", children: "Evoluci\u00F3n de Fuerza" })] }) }), _jsxs("div", { className: "relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-md overflow-hidden", children: [_jsx("div", { className: "absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16" }), _jsxs("div", { className: "relative", children: [_jsxs("div", { className: "flex items-center gap-3 mb-3", children: [_jsx("div", { className: "p-2 bg-blue-500 rounded-lg shadow-sm", children: _jsx(Info, { className: "w-5 h-5 text-white" }) }), _jsx("h4", { className: "font-bold text-blue-800 text-lg", children: "M\u00E9todo Brzycki" })] }), _jsx("p", { className: "text-gray-700 mb-4 leading-relaxed", children: "Calcula tu m\u00E1ximo peso para 1 repetici\u00F3n (1RM) basado en tu desempe\u00F1o con m\u00E1s repeticiones, proporcionando una estimaci\u00F3n de tu fuerza m\u00E1xima en un ejercicio." })] })] }), _jsxs("div", { className: "relative", children: [_jsx("label", { className: "block text-sm font-semibold text-gray-700 mb-2", children: "Selecciona el ejercicio" }), _jsxs("div", { className: "relative", children: [_jsx("select", { className: "w-full appearance-none bg-white p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium shadow-sm hover:shadow-md", value: selectedExercise, onChange: (e) => setSelectedExercise(e.target.value), children: Object.keys(data.currentMaxRms).map(ex => (_jsx("option", { value: ex, children: ex }, ex))) }), _jsx(ChevronDown, { className: "absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" })] })] }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-4", children: [_jsxs("div", { className: "bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Award, { className: "w-5 h-5 text-purple-600" }), _jsx("span", { className: "text-sm font-semibold text-purple-700", children: "RM ACTUAL" })] }), _jsxs("div", { className: "text-2xl font-bold text-purple-800", children: [currentRM.toFixed(1), " kg"] })] }), _jsxs("div", { className: "bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200 shadow-sm", children: [_jsxs("div", { className: "flex items-center gap-3 mb-2", children: [_jsx(Info, { className: "w-5 h-5 text-blue-600" }), _jsx("span", { className: "text-sm font-semibold text-blue-700", children: "REGISTROS" })] }), _jsx("div", { className: "text-2xl font-bold text-blue-800", children: chartData.length })] })] }), _jsxs("div", { className: "bg-white p-6 rounded-2xl border border-gray-200 shadow-lg", children: [_jsxs("h4", { className: "text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2", children: [_jsx(TrendingUp, { className: "w-5 h-5 text-blue-500" }), "Progreso en ", selectedExercise] }), _jsx("div", { className: "h-80", children: _jsx(ResponsiveContainer, { width: "100%", height: "100%", children: _jsxs(LineChart, { data: chartData, margin: { top: 20, right: 30, left: 20, bottom: 20 }, children: [_jsx("defs", { children: _jsxs("linearGradient", { id: "rmGradient", x1: "0", y1: "0", x2: "0", y2: "1", children: [_jsx("stop", { offset: "5%", stopColor: "#3b82f6", stopOpacity: 0.1 }), _jsx("stop", { offset: "95%", stopColor: "#3b82f6", stopOpacity: 0 })] }) }), _jsx(CartesianGrid, { strokeDasharray: "3 3", stroke: "#f1f5f9", strokeWidth: 1 }), _jsx(XAxis, { dataKey: "date", tick: { fontSize: 12, fill: '#64748b' }, tickMargin: 15, axisLine: { stroke: '#e2e8f0', strokeWidth: 2 } }), _jsx(YAxis, { label: {
                                            value: 'RM (kg)',
                                            angle: -90,
                                            position: 'insideLeft',
                                            fontSize: 12,
                                            fill: '#64748b'
                                        }, tick: { fontSize: 12, fill: '#64748b' }, axisLine: { stroke: '#e2e8f0', strokeWidth: 2 } }), _jsx(Tooltip, { contentStyle: {
                                            borderRadius: '12px',
                                            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                                            border: 'none',
                                            backgroundColor: 'white',
                                            padding: '12px'
                                        }, formatter: (value, name) => {
                                            if (name === 'rm')
                                                return [`${parseFloat(value).toFixed(1)} kg`, 'RM Estimado'];
                                            if (name === 'peso')
                                                return [`${parseFloat(value).toFixed(1)} kg`, 'Peso Usado'];
                                            return [`${parseFloat(value).toFixed(1)}`, 'kg'];
                                        }, labelStyle: { color: '#374151', fontWeight: 'bold' } }), _jsx(Legend, { wrapperStyle: { paddingTop: '20px' }, iconType: "circle" }), _jsx(Line, { type: "monotone", dataKey: "rm", name: "RM Estimado", stroke: "#3b82f6", strokeWidth: 3, dot: { r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }, activeDot: {
                                            r: 8,
                                            fill: '#2563eb',
                                            strokeWidth: 3,
                                            stroke: '#ffffff',
                                            boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
                                        }, fill: "url(#rmGradient)" })] }) }) })] })] }));
};
