import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
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
import DashboardNutritionistPlans from "./pages/Nutritionist/DashboardNutritionistPlans";
import NutritionPlanEdit from "./pages/Nutritionist/NutritionPlanEdit";
import DashboardTrainer from "./pages/Trainer/DashboardTrainer";
import ExerciseCrud from "./pages/Admin/ExerciseCrud";
import TrainingPlanEdit from "./pages/Trainer/TrainingPlanEdit";
import TrainingPlans from "./pages/Trainer/TrainingPlans";
import ChangePasswordPage from "./pages/ChangePasswordPage";
import ResetPasswordPage from "./pages/Admin/AdminResetPasswordPage";
// Importar componentes de rutas protegidas
import { ClientRoute, TrainerRoute, NutritionistRoute, AdminRoute, TrainerAdminRoute, AllRolesRoute } from "./auth/ProtectedRoute";
import ReportClient from "./pages/Trainer/ReportClient";
import NotFound from "./components/NotFound";
import NutritionReportPage from "./pages/Nutritionist/NutritionReport";
function App() {
    return (_jsx(Router, { children: _jsxs(Routes, { children: [_jsx(Route, { path: "/", element: _jsx(LogIn, {}) }), _jsx(Route, { path: "/client", element: _jsx(ClientRoute, { children: _jsx(ClientDashboard, {}) }) }), _jsx(Route, { path: "/client/history/:dni", element: _jsx(ClientRoute, { children: _jsx(ClientHistory, {}) }) }), _jsx(Route, { path: "/client/training-plan", element: _jsx(ClientRoute, { children: _jsx(TrainingPlanPage, {}) }) }), _jsx(Route, { path: "/client/training-plan/:trainingPlanId/records", element: _jsx(ClientRoute, { children: _jsx(TrainingRecordsPage, {}) }) }), _jsx(Route, { path: "/client/:dni/progress", element: _jsx(ClientRoute, { children: _jsx(ProgressPage, {}) }) }), _jsx(Route, { path: "/client/nutrition-plan", element: _jsx(ClientRoute, { children: _jsx(NutritionPlanPage, {}) }) }), _jsx(Route, { path: "/client/nutrition-plans/:nutritionPlanId/records", element: _jsx(ClientRoute, { children: _jsx(NutritionRecordsPage, {}) }) }), _jsx(Route, { path: "/trainer/client/:dni/history", element: _jsx(TrainerRoute, { children: _jsx(ClientHistory, {}) }) }), _jsx(Route, { path: "/admin", element: _jsx(AdminRoute, { children: _jsx(DashboardAdmin, {}) }) }), _jsx(Route, { path: "/admin/clients", element: _jsx(AdminRoute, { children: _jsx(ClientCrud, {}) }) }), _jsx(Route, { path: "/admin/trainers", element: _jsx(AdminRoute, { children: _jsx(TrainerCrud, {}) }) }), _jsx(Route, { path: "/admin/nutritionists", element: _jsx(AdminRoute, { children: _jsx(NutritionistCrud, {}) }) }), _jsx(Route, { path: "/admin/reset-password", element: _jsx(AdminRoute, { children: _jsx(ResetPasswordPage, {}) }) }), _jsx(Route, { path: "/trainer/dashboard", element: _jsx(TrainerRoute, { children: _jsx(DashboardTrainer, {}) }) }), _jsx(Route, { path: "/trainer/client/:clientDni/training-plans", element: _jsx(TrainerRoute, { children: _jsx(TrainingPlans, {}) }) }), _jsx(Route, { path: "/trainer/client/:clientDni/training-plans/:planId/edit", element: _jsx(TrainerRoute, { children: _jsx(TrainingPlanEdit, {}) }) }), _jsx(Route, { path: "/trainer/client/:clientDni/training-plans/report", element: _jsx(TrainerRoute, { children: _jsx(ReportClient, {}) }) }), _jsx(Route, { path: "/trainer/client/:dni/progress", element: _jsx(TrainerRoute, { children: _jsx(ProgressPage, {}) }) }), _jsx(Route, { path: "/nutritionist/dashboard", element: _jsx(NutritionistRoute, { children: _jsx(DashboardNutritionist, {}) }) }), _jsx(Route, { path: "/nutritionist/client/:dni/history", element: _jsx(NutritionistRoute, { children: _jsx(ClientHistory, {}) }) }), _jsx(Route, { path: "/nutritionist/client/:clientDni/nutrition-plans", element: _jsx(NutritionistRoute, { children: _jsx(DashboardNutritionistPlans, {}) }) }), _jsx(Route, { path: "/nutritionist/client/:clientDni/nutrition-plans/:planId/edit", element: _jsx(NutritionistRoute, { children: _jsx(NutritionPlanEdit, {}) }) }), _jsx(Route, { path: "/nutritionist/client/:clientDni/nutrition-plans/report", element: _jsx(NutritionistRoute, { children: _jsx(NutritionReportPage, {}) }) }), _jsx(Route, { path: "/exercises", element: _jsx(TrainerAdminRoute, { children: _jsx(ExerciseCrud, {}) }) }), _jsx(Route, { path: "/change-password", element: _jsx(AllRolesRoute, { children: _jsx(ChangePasswordPage, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }));
}
export default App;
