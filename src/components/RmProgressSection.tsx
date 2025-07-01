import { useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, Award, Info, ChevronDown, Zap } from 'lucide-react';

export const RmProgressSection = ({ data}) => {
  const [selectedExercise, setSelectedExercise] = useState(
    data ? Object.keys(data.currentMaxRms)[0] : ''
  );

  if (!data) return null;

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

  return (
    <div className="space-y-8">
      {/* Header con gradiente */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-3">
          <div className="p-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl shadow-lg">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-red-600 bg-clip-text text-transparent">
            Evolución de Fuerza
          </h3>
        </div>
      </div>
      
      {/* Explicación Brzycki mejorada */}
      <div className="relative bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-200 shadow-md overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-200/30 to-indigo-200/30 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="relative">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg shadow-sm">
              <Info className="w-5 h-5 text-white" />
            </div>
            <h4 className="font-bold text-blue-800 text-lg">Método Brzycki</h4>
          </div>
          <p className="text-gray-700 mb-4 leading-relaxed">
            Calcula tu máximo peso para 1 repetición (1RM) basado en tu desempeño con más repeticiones, 
            proporcionando una estimación de tu fuerza máxima en un ejercicio.
          </p>
          {/* <div className="bg-white/80 backdrop-blur-sm px-4 py-3 rounded-xl border border-blue-100">
            <code className="block text-blue-800 font-mono text-sm">
              1RM = Peso ÷ (1.0278 - (0.0278 × Repeticiones))
            </code>
          </div> */}
        </div>
      </div>

      {/* Selector de ejercicio mejorado */}
      <div className="relative">
        <label className="block text-sm font-semibold text-gray-700 mb-2">
          Selecciona el ejercicio
        </label>
        <div className="relative">
          <select
            className="w-full appearance-none bg-white p-4 pr-12 border-2 border-gray-200 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all duration-200 text-gray-800 font-medium shadow-sm hover:shadow-md"
            value={selectedExercise}
            onChange={(e) => setSelectedExercise(e.target.value)}
          >
            {Object.keys(data.currentMaxRms).map(ex => (
              <option key={ex} value={ex}>{ex}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Estadísticas destacadas */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl border border-green-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5 text-green-600" />
            <span className="text-sm font-semibold text-green-700">MEJORA TOTAL</span>
          </div>
          <div className="text-2xl font-bold text-green-800">
            {improvement >= 0 ? '+' : ''}{improvement.toFixed(1)}%
          </div>
        </div> */}
        
        <div className="bg-gradient-to-br from-purple-50 to-violet-50 p-5 rounded-2xl border border-purple-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Award className="w-5 h-5 text-purple-600" />
            <span className="text-sm font-semibold text-purple-700">RM ACTUAL</span>
          </div>
          <div className="text-2xl font-bold text-purple-800">
            {currentRM.toFixed(1)} kg
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-5 rounded-2xl border border-blue-200 shadow-sm">
          <div className="flex items-center gap-3 mb-2">
            <Info className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">REGISTROS</span>
          </div>
          <div className="text-2xl font-bold text-blue-800">
            {chartData.length}
          </div>
        </div>
      </div>

      {/* Gráfico mejorado */}
      <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-lg">
        <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-blue-500" />
          Progreso en {selectedExercise}
        </h4>
        
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
            >
              <defs>
                <linearGradient id="rmGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.1}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" strokeWidth={1} />
              <XAxis 
                dataKey="date" 
                tick={{ fontSize: 12, fill: '#64748b' }}
                tickMargin={15}
                axisLine={{ stroke: '#e2e8f0', strokeWidth: 2 }}
              />
              <YAxis 
                label={{ 
                  value: 'RM (kg)', 
                  angle: -90, 
                  position: 'insideLeft',
                  fontSize: 12,
                  fill: '#64748b'
                }}
                tick={{ fontSize: 12, fill: '#64748b' }}
                axisLine={{ stroke: '#e2e8f0', strokeWidth: 2 }}
              />
              <Tooltip 
                contentStyle={{
                  borderRadius: '12px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: 'none',
                  backgroundColor: 'white',
                  padding: '12px'
                }}
                formatter={(value, name) => {
                  if (name === 'rm') return [`${parseFloat(value).toFixed(1)} kg`, 'RM Estimado'];
                  if (name === 'peso') return [`${parseFloat(value).toFixed(1)} kg`, 'Peso Usado'];
                  return [`${parseFloat(value).toFixed(1)}`, 'kg'];
                }}
                labelStyle={{ color: '#374151', fontWeight: 'bold' }}
              />
              <Legend 
                wrapperStyle={{ paddingTop: '20px' }}
                iconType="circle"
              />
              <Line 
                type="monotone" 
                dataKey="rm" 
                name="RM Estimado" 
                stroke="#3b82f6" 
                strokeWidth={3}
                dot={{ r: 5, fill: '#3b82f6', strokeWidth: 2, stroke: '#ffffff' }}
                activeDot={{ 
                  r: 8, 
                  fill: '#2563eb', 
                  strokeWidth: 3, 
                  stroke: '#ffffff',
                  boxShadow: '0 0 0 4px rgba(59, 130, 246, 0.2)'
                }}
                fill="url(#rmGradient)"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Máximo actual destacado */}
      {/* <div className="relative bg-gradient-to-r from-indigo-500 to-purple-600 p-8 rounded-2xl shadow-2xl overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full bg-black opacity-5"></div>
        <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full"></div>
        <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-white/10 rounded-full"></div>
        
        <div className="relative text-center">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-white/20 rounded-full backdrop-blur-sm">
              <Award className="w-8 h-8 text-white" />
            </div>
            <span className="text-white/90 text-lg font-semibold">RÉCORD PERSONAL</span>
          </div>
          
          <div className="text-white">
            <p className="text-xl mb-2">{selectedExercise}</p>
            <p className="text-5xl font-bold mb-2">{currentRM.toFixed(1)} <span className="text-2xl">kg</span></p>
            <p className="text-white/80">Tu máximo estimado actual</p>
          </div>
        </div>
      </div> */}
    </div>
  );
};