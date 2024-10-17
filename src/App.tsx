
import './index.css'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LogIn from './components/Login'
import DashboardAdmin from './components/DashboardAdmin';
import ClientManagement from './components/ClientManagAdmin';
import TraineersManager from './components/TraineersManager';

function App() {
  return (
  <Router>
    <Routes>
      <Route path="/" element={<LogIn/>} />
      <Route path="/admin" element={<DashboardAdmin/>} />
      <Route path="/admin/clients" element={<ClientManagement/>} />
      <Route path="/clients" element={<ClientManagement/>} />

      <Route path="/traineers" element={<TraineersManager/>} />

    </Routes>
  </Router>
  )
}

export default App
