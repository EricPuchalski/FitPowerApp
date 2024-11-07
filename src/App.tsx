
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import ClientManagement from './components/ClientManagAdmin';

import DashboardClient from './components/DashboardClient';
import NutritionistCrud from './components/NutritionistCrud';
import TraineersManager from './components/TraineersManager';
import TrainerCrud from './components/TrainerCrud';
import ClientCrud from './components/ClientCrud';
import DashboardTrainer from './components/DashboardTrainerReal';
import TrainingClient from './components/TrainingClient';
import ClientRoutine from './components/ClientRoutine';


function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/client" element={<DashboardClient/>} />
      <Route path="/admin" element={<DashboardAdmin/>} />
      <Route path="/trainer" element={<DashboardTrainer/>} />
      <Route path="/trainerCrud" element={<TrainerCrud/>} />
      <Route path="/nutritionistCrud" element={<NutritionistCrud/>} />
      <Route path="/traineers" element={<TraineersManager/>} />
      <Route path="/admin/clients" element={<ClientCrud/>} />
      <Route path="/client/training" element={<TrainingClient/>} />
      <Route path="/client/training/routine" element={<ClientRoutine/>} />

    </Routes>
  </Router>
  )
}

export default App
