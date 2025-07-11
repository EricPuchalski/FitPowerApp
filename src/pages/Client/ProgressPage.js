import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ExerciseProgressSection } from "../../components/ExerciseProgressSection";
import { RmProgressSection } from "../../components/RmProgressSection";
import { FooterPag } from "../../components/Footer";
import { WorkoutFrequencySection } from "../../components/WorkoutFrecuencySection";
const ProgressPage = () => {
    const { dni } = useParams();
    const [trainingData, setTrainingData] = useState(null);
    const [rmData, setRmData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem("token");
                const [trainingRes, rmRes] = await Promise.all([
                    fetch(`http://localhost:8080/api/v1/clients/${dni}/progress/training`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    fetch(`http://localhost:8080/api/v1/clients/${dni}/progress/rm-evolution`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);
                if (!trainingRes.ok || !rmRes.ok)
                    throw new Error("Error al cargar datos");
                setTrainingData(await trainingRes.json());
                setRmData(await rmRes.json());
            }
            catch (err) {
                setError(err.message);
            }
            finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [dni]);
    if (loading)
        return (_jsx("div", { className: "flex justify-center items-center h-screen", children: _jsx("div", { className: "animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500" }) }));
    if (error)
        return (_jsxs(_Fragment, { children: [_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al Inicio" })] }) }), _jsx("div", { className: "flex items-center justify-center min-h-[550px] px-4", children: _jsx("div", { className: "bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-8 max-w-md w-full text-center shadow-lg", children: _jsxs("div", { className: "mb-4", children: [_jsx("div", { className: "w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4", children: _jsx("svg", { className: "w-8 h-8 text-blue-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" }) }) }), _jsx("h3", { className: "text-xl font-semibold text-gray-800 mb-2", children: "Sin registros disponibles" }), _jsx("p", { className: "text-gray-600 mb-6", children: "Todav\u00EDa no hay registros cargados, por lo que no se puede calcular el progreso." })] }) }) }), ");", _jsx(FooterPag, {})] }));
    return (_jsxs(_Fragment, { children: [_jsx("header", { className: "bg-indigo-800 text-white shadow-md", children: _jsxs("div", { className: "container mx-auto px-4 py-4 flex justify-between items-center", children: [_jsx("h1", { className: "text-2xl font-bold", children: "FITPOWER" }), _jsx("button", { onClick: () => navigate(-1), className: "px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition-colors", children: "Volver al Inicio" })] }) }), _jsxs("div", { className: "container mx-auto px-4 py-8 max-w-7xl", children: [_jsxs("header", { className: "text-center mb-12 bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-xl shadow-lg border border-blue-100", children: [_jsx("h1", { className: "text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4", children: "Progreso de entrenamiento" }), _jsxs("div", { className: "text-lg text-gray-700 space-y-2", children: [_jsx("p", { className: "font-medium text-gray-800", children: rmData?.clientName }), _jsxs("div", { className: "flex items-center justify-center gap-3 flex-wrap", children: [_jsx("span", { className: "text-gray-600", children: "Del" }), _jsx("span", { className: "bg-blue-100 text-blue-800 px-4 py-2 rounded-lg font-semibold border border-blue-200 shadow-sm", children: trainingData?.startDate }), _jsx("span", { className: "text-gray-600", children: "al" }), _jsx("span", { className: "bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg font-semibold border border-indigo-200 shadow-sm", children: trainingData?.endDate })] })] })] }), _jsxs("div", { className: "grid grid-cols-1 gap-6", children: [_jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsx(ExerciseProgressSection, { data: trainingData?.exerciseProgress }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsx(WorkoutFrequencySection, { workoutFrequency: trainingData?.workoutFrequency }) }), _jsx("div", { className: "bg-white rounded-xl shadow-md p-6", children: _jsx(RmProgressSection, { data: rmData }) })] })] }), _jsx(FooterPag, {})] }));
};
export default ProgressPage;
