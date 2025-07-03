import { TrendingUp, TrendingDown, Activity, Clock, RotateCcw } from 'lucide-react';

export const ExerciseProgressSection = ({ data }) => {
  if (!data) return null;

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
          Progreso por Ejercicio
        </h3>
        <p className="text-gray-600">Tu evolución detallada en cada movimiento</p>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Object.entries(data).map(([name, stats], index) => (
          <div 
            key={name} 
            className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transform hover:-translate-y-1 transition-all duration-300 border border-gray-100 hover:border-blue-200"
            style={{
              animationDelay: `${index * 150}ms`,
              animation: 'fadeInUp 0.6s ease forwards'
            }}
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

            {/* Barra de progreso mejorada */}
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
                  style={{ 
                    width: `${Math.min(100, Math.abs(stats.progressPercentage))}%`,
                    animationDelay: `${index * 200 + 500}ms`
                  }}
                >
                  <div className="h-full w-full bg-white opacity-30 animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Métricas adicionales */}
            <div className="grid grid-cols-2 gap-3">
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                <Activity className="w-4 h-4 text-orange-500" />
                <div>
                  <div className="text-xs text-gray-600">Reps máx</div>
                  <div className="font-bold text-gray-800">{stats.maxRepetitions}</div>
                </div>
              </div>
              
              <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg group-hover:bg-gray-100 transition-colors">
                <Clock className="w-4 h-4 text-blue-500" />
                <div>
                  <div className="text-xs text-gray-600">Descanso</div>
                  <div className="font-bold text-gray-800">{stats.minRestTime}s</div>
                </div>
              </div>
            </div>

            {/* Efecto de hover decorativo */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500/0 to-purple-500/0 group-hover:from-blue-500/5 group-hover:to-purple-500/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
};