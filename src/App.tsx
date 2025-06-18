import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import NutritionistCrud from './components/NutritionistCrud';
import TraineersManager from './components/TraineersManager';
import TrainerCrud from './components/TrainerCrud';
import ClientCrud from './components/ClientCrud';
import TrainingClient from './components/TrainingClient';
import ClientRoutine from './components/ClientRoutine';
import ClientDashboard from './pages/DashboardClient';
import TrainingRecordsPage from './pages/TrainingRecords';
import TrainingPlanPage from './pages/TrainingPlan';

// Nuevos componentes del sistema de trainer (reemplazan los viejos que no funcionaban)
import DashboardTrainer from './components/DashboardTrainer';


import TrainingPlans from './components/TrainingPlans';
import TrainingPlanEdit from './components/TrainingPlanEdit';
import ClientProgress from './components/ClientProgress';

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login - MANTIENE */}
        <Route path="/" element={<LogIn />} />
        
        {/* Rutas del Cliente - TODAS MANTENIDAS */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route path="/client/training-plan/:trainingPlanId/records" element={<TrainingRecordsPage />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} />

        {/* Rutas del Administrador - TODAS MANTENIDAS */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/trainerCrud" element={<TrainerCrud />} />
        <Route path="/nutritionistCrud" element={<NutritionistCrud />} />
        <Route path="/traineers" element={<TraineersManager />} />

        {/* NUEVAS Rutas del Entrenador - Reemplazan las viejas que no funcionaban */}
        <Route path="/trainer/dashboard" element={<DashboardTrainer />} />
        <Route path="/trainer/client/:clientId/training-plans" element={<TrainingPlans />} />
        <Route path="/trainer/client/:clientId/training-plans/:planId/edit" element={<TrainingPlanEdit />} />
        <Route path="/trainer/client/:clientId/progress" element={<ClientProgress />} />

      </Routes>
    </Router>
  )
}

export default App;