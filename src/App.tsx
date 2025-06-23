import LogIn from './components/Login';
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ClientDashboard from './pages/DashboardClient';
import TrainingPlanPage from './pages/TrainingPlan';
import TrainingRecordsPage from './pages/TrainingRecords';


<<<<<<< Updated upstream
=======
import TrainingPlans from './components/TrainingPlans';
import TrainingPlanEdit from './components/TrainingPlanEdit';
import ClientProgress from './components/ClientProgress';
import NutritionPlanPage from './pages/NutritionPlan';
import NutritionRecordsPage from './pages/NutritionRecords';
>>>>>>> Stashed changes

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
<<<<<<< Updated upstream
=======
        
        {/* Entrenamiento - cliente */}
>>>>>>> Stashed changes
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route path="/client/training-plan/:trainingPlanId/records" element={<TrainingRecordsPage />} />

<<<<<<< Updated upstream
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
        <Route path="/client/nutrition-plans/:nutritionPlanId/records" element={<NutritionRecordsPage />} />


        {/* Rutas del Administrador - TODAS MANTENIDAS */}
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
>>>>>>> Stashed changes
        <Route path="/trainerCrud" element={<TrainerCrud />} />
        <Route path="/nutritionistCrud" element={<NutritionistCrud />} />
        <Route path="/traineers" element={<TraineersManager />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} /> */} 
        
      </Routes>
    </Router>
  )
}

export default App;
