import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import DashboardClient from './components/DashboardClient';
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


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LogIn />} />
        <Route path="/client" element={<DashboardClient />} />
        <Route path="/admin" element={<DashboardAdmin />} />
        <Route path="/trainer/client/:clientDni/training-plans/:trainingPlanId/routine" element={<TrainerRoutine />} />
        <Route path="/trainer/clients" element={<TrainerClientList />} />
        <Route path="/trainer/client/:clientDni/training-plan" element={<TrainerTrainingPlan />} />
        <Route path="/trainer/client/:clientDni/training-logs" element={<ClientTrainingDiaries />} />
        <Route path="/trainer/client/:clientDni/training-plan/history" element={<TrainingPlansList />} />
        <Route path="/trainer/client/:clientDni/charts" element={<ClientPhysicalStatusChart />} />
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
