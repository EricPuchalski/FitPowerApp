
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import ClientManagement from './components/ClientManagAdmin';
import DashboardClient from './components/DashboardClient';
import DashboardTrainer from './components/DashboardTrainer';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/clients" element={<DashboardClient/>} />
      <Route path="/admin" element={<DashboardAdmin/>} />
      <Route path="/admin/clients" element={<ClientManagement/>} />
      <Route path="/trainer" element={<DashboardTrainer/>} />
    </Routes>
  </Router>
  )
}

export default App
