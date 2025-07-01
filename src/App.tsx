import LogIn from "./components/Login";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ClientDashboard from "./pages/Client/DashboardClient";
import TrainingPlanPage from "./pages/Client/TrainingPlan";
import TrainingRecordsPage from "./pages/Client/TrainingRecords";
import NutritionPlanPage from "./pages/Client/NutritionPlan";
import NutritionRecordsPage from "./pages/Client/NutritionRecords";
import ClientHistory from "./pages/Client/ClientHistory";
import ProgressPage from "./pages/Client/ProgressPage";
import DashboardAdmin from "./pages/Admin/DashboardAdmin";
import ClientCrud from "./pages/Admin/ClientCrud";
import TrainerCrud from "./pages/Admin/TrainerCrud";
import NutritionistCrud from "./pages/Admin/NutritionistCrud";
import DashboardNutritionist from "./pages/Nutritionist/DashboardNutritionist";
import DashboardTrainer from "./pages/Trainer/DashboardTrainer";
import ExerciseCrud from "./pages/Admin/ExerciseCrud";
import TrainingPlanEdit from "./pages/Trainer/TrainingPlanEdit";
import TrainingPlans from "./pages/Trainer/TrainingPlans";

// Importar componentes de rutas protegidas
import {
  ClientRoute,
  TrainerRoute,
  NutritionistRoute,
  AdminRoute,
  TrainerAdminRoute
} from "./auth/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Ruta de login - Sin protección */}
        <Route path="/" element={<LogIn />} />

        {/* ==================== RUTAS DEL CLIENTE ==================== */}
        <Route 
          path="/client" 
          element={
            <ClientRoute>
              <ClientDashboard />
            </ClientRoute>
          } 
        />
        <Route 
          path="/client/history/:dni" 
          element={
            <ClientRoute>
              <ClientHistory />
            </ClientRoute>
          } 
        />
        <Route 
          path="/client/training-plan" 
          element={
            <ClientRoute>
              <TrainingPlanPage />
            </ClientRoute>
          } 
        />
        <Route 
          path="/client/training-plan/:trainingPlanId/records" 
          element={
            <ClientRoute>
              <TrainingRecordsPage />
            </ClientRoute>
          } 
        />
        <Route 
          path="/client/:dni/progress" 
          element={
            <ClientRoute>
              <ProgressPage />
            </ClientRoute>
          } 
        />
        <Route 
          path="/client/nutrition-plan" 
          element={
            <ClientRoute>
              <NutritionPlanPage />
            </ClientRoute>
          } 
        />
        <Route 
          path="/client/nutrition-plans/:nutritionPlanId/records" 
          element={
            <ClientRoute>
              <NutritionRecordsPage />
            </ClientRoute>
          } 
        />

        {/* ==================== RUTAS DEL ADMINISTRADOR ==================== */}
        <Route 
          path="/admin" 
          element={
            <AdminRoute>
              <DashboardAdmin />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/clients" 
          element={
            <AdminRoute>
              <ClientCrud />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/trainers" 
          element={
            <AdminRoute>
              <TrainerCrud />
            </AdminRoute>
          } 
        />
        <Route 
          path="/admin/nutritionists" 
          element={
            <AdminRoute>
              <NutritionistCrud />
            </AdminRoute>
          } 
        />

        {/* ==================== RUTAS DEL ENTRENADOR ==================== */}
        <Route 
          path="/trainer/dashboard" 
          element={
            <TrainerRoute>
              <DashboardTrainer />
            </TrainerRoute>
          } 
        />
        <Route 
          path="/trainer/client/:clientDni/training-plans" 
          element={
            <TrainerRoute>
              <TrainingPlans />
            </TrainerRoute>
          } 
        />
        <Route 
          path="/trainer/client/:clientDni/training-plans/:planId/edit" 
          element={
            <TrainerRoute>
              <TrainingPlanEdit />
            </TrainerRoute>
          } 
        />

        {/* ==================== RUTAS DEL NUTRICIONISTA ==================== */}
        <Route 
          path="/nutritionist/dashboard" 
          element={
            <NutritionistRoute>
              <DashboardNutritionist />
            </NutritionistRoute>
          } 
        />

        {/* ==================== RUTAS COMPARTIDAS ==================== */}
        {/* Ejercicios - Solo Trainer y Admin pueden acceder */}
        <Route 
          path="/exercises" 
          element={
            <TrainerAdminRoute>
              <ExerciseCrud />
            </TrainerAdminRoute>
          } 
        />

      </Routes>
    </Router>
  );
}

export default App;