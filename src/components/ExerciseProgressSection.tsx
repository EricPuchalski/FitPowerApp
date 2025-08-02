import { TrendingUp, TrendingDown, Activity, Clock, RotateCcw } from 'lucide-react';
import { useState } from 'react';

export const ExerciseProgressSection = ({ data }) => {
  const [sortBy, setSortBy] = useState('progress'); // 'progress', 'name', 'weight'
  const [filterPositive, setFilterPositive] = useState(false);

  if (!data) return null;

  // Procesar y ordenar datos
  let exercises = Object.entries(data);
  
  if (filterPositive) {
    exercises = exercises.filter(([_, stats]) => stats.progressPercentage > 0);
  }

  exercises.sort(([nameA, statsA], [nameB, statsB]) => {
    switch (sortBy) {
      case 'progress':
        return statsB.progressPercentage - statsA.progressPercentage;
      case 'name':
        return nameA.localeCompare(nameB);
      case 'weight':
        return statsB.currentAverageWeight - statsA.currentAverageWeight;
      default:
        return 0;
    }
  });

  const positiveProgress = exercises.filter(([_, stats]) => stats.progressPercentage > 0).length;
  const totalExercises = exercises.length;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Progreso por Ejercicio
        </h3>
        <p className="text-gray-600">Tu evolución detallada en cada movimiento</p>
      </div>

      {/* Estadísticas generales */}
      <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-indigo-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
          <div>
            <div className="text-2xl font-bold text-indigo-700">{totalExercises}</div>
            <div className="text-sm text-indigo-600">Ejercicios totales</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-green-700">{positiveProgress}</div>
            <div className="text-sm text-green-600">Con progreso positivo</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-purple-700">
              {((positiveProgress / totalExercises) * 100).toFixed(0)}%
            </div>
            <div className="text-sm text-purple-600">Tasa de mejora</div>
          </div>
        </div>
      </div>

      {/* Controles de filtrado y ordenamiento */}
      <div className="flex flex-wrap gap-4 items-center justify-between bg-white p-4 rounded-xl shadow-sm border border-gray-200">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700">Ordenar por:</label>
            <select 
              value={sortBy} 
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="progress">Progreso</option>
              <option value="name">Nombre</option>
              <option value="weight">Peso actual</option>
            </select>
          </div>
          
          <label className="flex items-center gap-2 cursor-pointer">
            <input 
              type="checkbox" 
              checked={filterPositive}
              onChange={(e) => setFilterPositive(e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">Solo progreso positivo</span>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {exercises.map(([name, stats], index) => (
          <div 
            key={name} 
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-blue-200"
          >
            {/* Indicador de tendencia */}
            <div className="absolute -top-3 -right-3">
              <div className={`p-2 rounded-full shadow-lg ${
                stats.progressPercentage >= 0 
                  ? 'bg-gradient-to-r from-green-500 to-emerald-500' 
                  : 'bg-gradient-to-r from-red-500 to-pink-500'
              }`}>
                {stats.progressPercentage >= 0 ? (
                  <TrendingUp className="w-5 h-5 text-white" />
                ) : (
                  <TrendingDown className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            {/* Header del ejercicio */}
            <div className="mb-6">
              <h4 className="font-bold text-xl text-gray-800 mb-2 group-hover:text-blue-600 transition-colors">
                {name}
              </h4>
              
              {/* Estadísticas principales */}
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-3 rounded-xl border border-blue-100">
                  <div className="text-xs text-blue-600 font-medium mb-1">INICIAL</div>
                  <div className="text-lg font-bold text-blue-700">{stats.initialAverageWeight.toFixed(1)} kg</div>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-3 rounded-xl border border-purple-100">
                  <div className="text-xs text-purple-600 font-medium mb-1">ACTUAL</div>
                  <div className="text-lg font-bold text-purple-700">{stats.currentAverageWeight.toFixed(1)} kg</div>
                </div>
              </div>
            </div>

            {/* Barra de progreso */}
            <div className="mb-4">
              <div className="flex justify-between items-center mb-2">
                <span className="text-sm font-medium text-gray-600">Progreso en peso</span>
                <span className={`text-sm font-bold px-2 py-1 rounded-full ${
                  stats.progressPercentage >= 0 
                    ? 'bg-green-100 text-green-700' 
                    : 'bg-red-100 text-red-700'
                }`}>
                  {stats.progressPercentage >= 0 ? '+' : ''}{stats.progressPercentage.toFixed(1)}%
                </span>
              </div>
              
              <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                  className={`h-3 rounded-full transition-all duration-1000 ease-out ${
                    stats.progressPercentage >= 0 
                      ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                      : 'bg-gradient-to-r from-red-400 to-pink-500'
                  }`}
                  style={{ width: `${Math.min(100, Math.abs(stats.progressPercentage))}%` }}
                />
              </div>
            </div>
            
            {/* Métricas adicionales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Activity className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-600">Reps máx</div>
                  <div className="font-bold text-gray-800">{stats.maxRepetitions}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-600">Descanso</div>
                  <div className="font-bold text-gray-800">{stats.minRestTime}s</div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
