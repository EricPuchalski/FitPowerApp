
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import ClientManagement from './components/ClientManagAdmin';
import TraineersManager from './components/TraineersManager';
import TrainerCrud from './components/TrainerCrud';
import NutritionistCrud from './components/NutritionistCrud';
import ClientCrud from './components/ClientCrud';



function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/admin" element={<DashboardAdmin/>} />
      <Route path="/admin/clients" element={<ClientManagement/>} />
      <Route path="/clients" element={<ClientManagement/>} />
      <Route path="/trainerCrud" element={<TrainerCrud/>} />
      <Route path="/nutritionistCrud" element={<NutritionistCrud/>} />
      <Route path="/clientCrud" element={<ClientCrud/>} />




      <Route path="/traineers" element={<TraineersManager/>} />

    </Routes>
  </Router>
  )
}

export default App
