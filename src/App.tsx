// src/App.tsx
import './index.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login';
import DashboardAdmin from './components/DashboardAdmin';
import NutritionistCrud from './components/NutritionistCrud';
import TraineersManager from './components/TraineersManager';
import TrainerCrud from './components/TrainerCrud';
import ClientCrud from './components/ClientCrud';
import TrainingClient from './components/TrainingClient';
import ClientRoutine from './components/ClientRoutine';
import ClientDashboard from './pages/DashboardClient';
import TrainingPlanPage from './pages/TrainingPlan';
import TrainingRecordsPage from './pages/TrainingRecords';
import NutritionPlanPage from './pages/NutritionPlan'; // Nuevo de develop-Puchalski
import NutritionRecordsPage from './pages/NutritionRecords'; // Nuevo de develop-Puchalski
import ClientHistory from './pages/ClientHistory'; // Nuevo de develop-Puchalski
import ProgressPage from './pages/ProgressPage'; // Nuevo de develop-Puchalski
import DashboardTrainer from './components/DashboardTrainer';
import TrainingPlans from './components/TrainingPlans';
import TrainingPlanEdit from './components/TrainingPlanEdit';
import ClientProgress from './components/ClientProgress';
import ExerciseCrud from './components/ExerciseCrud';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login */}
        <Route path="/" element={<LogIn />} />

        {/* Rutas del Cliente */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/history/:dni" element={<ClientHistory />} />

        {/* Entrenamiento - cliente */}
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route path="/client/training-plan/:trainingPlanId/records" element={<TrainingRecordsPage />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} />

        {/* Progreso - cliente */}
        <Route path="/client/:dni/progress" element={<ProgressPage />} />

        {/* Nutrición - cliente */}
        <Route path="/client/nutrition-plan" element={<NutritionPlanPage />} />
        <Route path="/client/nutrition-plans/:nutritionPlanId/records" element={<NutritionRecordsPage />} />

        {/* Rutas del Administrador */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/trainerCrud" element={<TrainerCrud />} />
        <Route path="/nutritionistCrud" element={<NutritionistCrud />} />
        <Route path="/traineers" element={<TraineersManager />} />

        {/* Rutas del Entrenador */}
        <Route path="/trainer/dashboard" element={<DashboardTrainer />} />
        <Route path="/trainer/client/:clientDni/training-plans" element={<TrainingPlans />} />
        <Route path="/trainer/client/:clientDni/training-plans/:planId/edit" element={<TrainingPlanEdit />} />
        <Route path="/trainer/client/:clientId/progress" element={<ClientProgress />} />

        {/* Ruta compartida para gestión de ejercicios (admin y trainer) */}
        <Route path="/exercises" element={<ExerciseCrud />} />
      </Routes>
    </Router>
  );
}

export default App;