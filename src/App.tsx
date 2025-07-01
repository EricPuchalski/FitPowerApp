
import LogIn from "./components/Login";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDashboard from "./pages/DashboardClient";
import TrainingPlanPage from "./pages/TrainingPlan";
import TrainingRecordsPage from "./pages/TrainingRecords";
import NutritionPlanPage from "./pages/NutritionPlan";
import NutritionRecordsPage from "./pages/NutritionRecords";
import ClientHistory from "./pages/ClientHistory";
import ProgressPage from "./pages/ProgressPage";
import DashboardAdmin from "./components/DashboardAdmin";
import ClientCrud from "./components/ClientCrud";
import TrainerCrud from "./components/TrainerCrud";
import NutritionistCrud from "./components/NutritionistCrud";
import TrainingClient from "./components/TrainingClient";
import ClientRoutine from "./components/ClientRoutine";
import ClientProgress from "./components/ClientProgress";
import DashboardNutritionist from "./components/DashboardNutritionist";
import DashboardTrainer from "./components/DashboardTrainer";
import ExerciseCrud from "./components/ExerciseCrud";
import TrainingPlanEdit from "./components/TrainingPlanEdit";
import TrainingPlans from "./components/TrainingPlans";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login */}
        <Route path="/" element={<LogIn />} />

        {/* Rutas del Cliente */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/history/:dni" element={<ClientHistory />} />
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route path="/client/training-plan/:trainingPlanId/records" element={<TrainingRecordsPage />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} />
        <Route path="/client/:dni/progress" element={<ProgressPage />} />

        {/* Entrenamiento - cliente */}
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route
          path="/client/training-plan/:trainingPlanId/records"
          element={<TrainingRecordsPage />}
        />

        {/* Progreso - cliente */}
        <Route path="/client/:dni/progress" element={<ProgressPage />} />

        
        {/* Nutricion- cliente*/}

        <Route path="/client/nutrition-plan" element={<NutritionPlanPage />} />
        <Route
          path="/client/nutrition-plans/:nutritionPlanId/records"
          element={<NutritionRecordsPage />}
        />


        {/* Rutas del Administrador - TODAS MANTENIDAS */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/admin/trainers" element={<TrainerCrud />} />
        <Route path="/admin/nutritionists" element={<NutritionistCrud />} />

        {/* 
        <Route path="/trainerCrud" element={<TrainerCrud />} />
        <Route path="/nutritionistCrud" element={<NutritionistCrud />} />
        <Route path="/traineers" element={<TraineersManager />} />

        {/* Rutas del Entrenador */}
        <Route path="/trainer/dashboard" element={<DashboardTrainer />} />
        <Route path="/trainer/client/:clientDni/training-plans" element={<TrainingPlans />} />
        <Route path="/trainer/client/:clientDni/training-plans/:planId/edit" element={<TrainingPlanEdit />} />
        <Route path="/trainer/client/:clientId/progress" element={<ClientProgress />} />

        {/* Rutas del Nutricionista */}
        <Route path="/nutritionist/dashboard" element={<DashboardNutritionist />} /> {/* ✅ NUEVA */}

        {/* Ruta compartida */}
        <Route path="/exercises" element={<ExerciseCrud />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} /> 

      </Routes>
    </Router>
  );
}

export default App;
