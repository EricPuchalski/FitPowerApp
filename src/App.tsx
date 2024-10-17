
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import ClientManagement from './components/ClientManagAdmin';
import DashboardClient from './components/DashboardClient';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/clients" element={<DashboardClient/>} />
      <Route path="/admin" element={<DashboardAdmin/>} />
      <Route path="/admin/clients" element={<ClientManagement/>} />
    </Routes>
  </Router>
  )
}

export default App
