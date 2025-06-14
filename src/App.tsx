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
import TrainerRoutine from './components/TrainerRoutine';
import TrainerClientList from './components/TrainerClients';
import TrainerTrainingPlan from './components/TrainerTrainingPlan';
import ModifyRoutine from './components/ModifyRoutine';
import ClientTrainingDiaries from './components/ClientTrainingDiaries';
import TrainingPlansList from './components/ClientTrainingPlans';
import ClientPhysicalStatusChart from './components/ClientPhysicalStatusChart';
import ProgressChart from './components/ProgressChart';
import ReportChart from './components/ReportChart';
import Report from './components/Report';
import TrainingPlanPage from './pages/TrainingPlan';
import ClientDashboard from './pages/DashboardClient';
import TrainingRecordsPage from './pages/TrainingRecords';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/client" element={<ClientDashboard />} />
        <Route path="/client/training-plan" element={<TrainingPlanPage />} />
        <Route path="/client/training-plan/:trainingPlanId/records" element={<TrainingRecordsPage />} />

        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/trainer/client/:clientDni/training-plans/:trainingPlanId/routine" element={<TrainerRoutine />} />
        <Route path="/trainer/clients" element={<TrainerClientList />} />
        <Route path="/trainer/client/:clientDni/training-plan" element={<TrainerTrainingPlan />} />
        <Route path="/trainer/client/:clientDni/training-logs" element={<ClientTrainingDiaries />} />
        <Route path="/trainer/client/:clientDni/training-plan/history" element={<TrainingPlansList />} />
        {/* <Route path="/trainer/client/:clientDni/charts" element={<ClientPhysicalStatusChart />} /> */}
                 <Route path="/trainer/client/:clientDni/charts" element={<ProgressChart clientDni={''} />} /> 
                 <Route path="/trainer/client/:clientDni/report" element={<Report clientDni={''} />} /> 

        <Route path="/modificar-rutina/:routineId" element={<ModifyRoutine />} />
        <Route path="/trainerCrud" element={<TrainerCrud />} />
        <Route path="/nutritionistCrud" element={<NutritionistCrud />} />
        <Route path="/traineers" element={<TraineersManager />} />
        <Route path="/admin/clients" element={<ClientCrud />} />
        <Route path="/client/training" element={<TrainingClient />} />
        <Route path="/client/training/routine" element={<ClientRoutine />} />
        
      </Routes>
    </Router>
  )
}

export default App;
