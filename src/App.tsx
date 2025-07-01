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

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />

        {/* Cliente */}
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/history/:dni" element={<ClientHistory />} />

        {/* Entrenamiento - cliente */}
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route
          path="/client/training-plan/:trainingPlanId/records"
          element={<TrainingRecordsPage />}
        />

        {/* Progreso - cliente */}
        <Route path="/client/:dni/progress" element={<ProgressPage />} />

        {/* <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/trainer/client/:clientDni/training-plans/:trainingPlanId/routine" element={<TrainerRoutine />} />
        <Route path="/trainer/clients" element={<TrainerClientList />} />
        <Route path="/trainer/client/:clientDni/training-plan" element={<TrainerTrainingPlan />} />
        <Route path="/trainer/client/:clientDni/training-logs" element={<ClientTrainingDiaries />} />
        <Route path="/trainer/client/:clientDni/training-plan/history" element={<TrainingPlansList />} />
        {/* <Route path="/trainer/client/:clientDni/charts" element={<ClientPhysicalStatusChart />} /> */}
        {/* <Route path="/trainer/client/:clientDni/charts" element={<ProgressChart clientDni={''} />} /> 
                 <Route path="/trainer/client/:clientDni/report" element={<Report clientDni={''} />} /> 

        <Route path="/modificar-rutina/:routineId" element={<ModifyRoutine />} />
=======
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
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} /> */}
      </Routes>
    </Router>
  );
}

export default App;
