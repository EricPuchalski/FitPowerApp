import React, { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, TrendingDown, Activity, Clock, Award, Info, ChevronDown, Zap, Calendar, Target, Flame } from 'lucide-react';

// Componente mejorado para mostrar frecuencia de entrenamiento
export const WorkoutFrequencySection = ({ workoutFrequency }) => {
  if (!workoutFrequency) return null;

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

  return (
    <div className="space-y-6">
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl shadow-lg">
            <Calendar className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
            Frecuencia de Entrenamiento
          </h3>
        </div>
        <p className="text-gray-600">Tu consistencia en el gimnasio</p>
      </div>

      {/* Estadísticas rápidas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Target className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">ENTRENAMIENTOS TOTALES</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">{totalWorkouts}</div>
        </div>

        <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Flame className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">PROMEDIO DIARIO</span>
          </div>
          <div className="text-2xl font-bold text-green-800">{averagePerDay.toFixed(1)}</div>
        </div>

        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Calendar className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">DÍAS ACTIVOS</span>
          </div>
          <div className="text-2xl font-bold text-purple-800">{Object.keys(workoutFrequency).length}</div>
        </div>
      </div>

      {/* Gráfico de barras */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <BarChart className="w-5 h-5 text-green-500" />
          Entrenamientos por día
        </h4>

        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={frequencyData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
              <defs>
                <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#059669" stopOpacity={0.8}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: '#64748b' }} />
              <YAxis tick={{ fontSize: 12, fill: '#64748b' }} />
              <Tooltip
                contentStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
                  border: 'none',
                  backgroundColor: 'white'
                }}
                formatter={(value) => [`${value}`, 'Entrenamientos']}
              />
              <Bar
                dataKey="entrenamientos"
                fill="url(#barGradient)"
                radius={[4, 4, 0, 0]}
                name="Entrenamientos"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};
