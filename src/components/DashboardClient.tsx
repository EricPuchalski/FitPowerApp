"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  User,
  Bell,
  Dumbbell,
  Apple,
  ChevronRight,
  BarChart2,
  Calendar,
  Settings,
} from "lucide-react";
import { FooterPag } from "./Footer";
import { Progress } from "../../components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
import { NavBarClient } from "./NavBarClient";

// Simulación de una librería de alimentos y calorías
const foodDatabase = [
  { name: "Manzana", caloriesPer100g: 52 },
  { name: "Pollo a la plancha", caloriesPer100g: 165 },
  { name: "Arroz blanco cocido", caloriesPer100g: 130 },
  { name: "Brócoli", caloriesPer100g: 34 },
  { name: "Salmón", caloriesPer100g: 208 },
];

type ClientStats = {
  date: string;
  weight: number;
  bodyFat: number;
  muscleMass: number;
  height: number;
};

type Client = {
  id: number;
  name: string;
  lastname: string;
  dni: string;
  phone: string;
  address: string;
  email: string;
  goal: string;
  gymName: string;
  trainerDni: string;
  nutritionistDni: string;
};

const clientUrl = "http://localhost:8080/api/clients/email/";

// Función para obtener los datos del cliente
async function getClientData(email: string, token: string) {
  try {
    const response = await fetch(`${clientUrl}${email}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error(`Error en la solicitud: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error al obtener los datos del cliente:", error);
    throw error;
  }
}

export default function DashboardClient() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [notificationCount, setNotificationCount] = useState(1);
  const [caloriesConsumed, setCaloriesConsumed] = useState(0);
  const [selectedFood, setSelectedFood] = useState("");
  const [foodAmount, setFoodAmount] = useState<string>("");
  const dailyCalorieGoal = 2000;
  const token = localStorage.getItem("token");
  const email = localStorage.getItem("userEmail");

  const [clientStats, setClientStats] = useState<ClientStats[]>([
    {
      date: "2023-01-01",
      weight: 80,
      bodyFat: 20,
      muscleMass: 35,
      height: 175,
    },
    {
      date: "2023-02-01",
      weight: 78,
      bodyFat: 19,
      muscleMass: 36,
      height: 175,
    },
    {
      date: "2023-03-01",
      weight: 76,
      bodyFat: 18,
      muscleMass: 37,
      height: 175,
    },
  ]);

  const [client, setClient] = useState<Client | null>(null);

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const data = await getClientData(email, token);
        setClient(data);
      } catch (error) {
        console.error("Error al obtener los datos del cliente:", error);
      }
    };

    fetchClientData();
  }, []);

  const handleAddFood = () => {
    const food = foodDatabase.find((f) => f.name === selectedFood);
    const amount = parseFloat(foodAmount);
    if (food && amount > 0) {
      const calories = (food.caloriesPer100g * amount) / 100;
      setCaloriesConsumed((prev) => prev + calories);
      setSelectedFood("");
      setFoodAmount("");
    }
  };

  if (!client) {
    return <div>Cargando...</div>;
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <NavBarClient />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-2xl font-semibold mb-4">Información personal</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <p>
                <strong>Nombre:</strong> {client.name || "No tiene"}
              </p>
              <p>
                <strong>Apellido:</strong> {client.lastname || "No tiene"}
              </p>
            </div>
            <div>
              <p>
                <strong>Gimnasio:</strong> {client.gymName || "No tiene"}
              </p>
              <p>
                <strong>Nutricionista:</strong>{" "}
                {client.nutritionistDni || "No tiene"}
              </p>
            </div>
            <div>
              <p>
                <strong>Entrenador:</strong> {client.trainerDni || "No tiene"}
              </p>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <User className="w-6 h-6 mr-2 text-blue-600" />
              Tu estado físico
            </h2>
            <div className="grid grid-cols-2 gap-6 mb-6 p-4 bg-gray-50 rounded-lg shadow-md">
              {/* Datos Iniciales */}
              <div className="border-r border-gray-300 pr-4">
                <h3 className="font-bold text-xl mb-4 text-blue-600">
                  Datos Iniciales
                </h3>
                <p className="mb-2">
                  <strong className="text-gray-700">Peso inicial:</strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[0].weight} kg
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Altura:</strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[0].height} cm
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Grasa corporal inicial:
                  </strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[0].bodyFat}%
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">
                    Masa muscular inicial:
                  </strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[0].muscleMass} kg
                  </span>
                </p>
              </div>
              {/* Datos Actuales */}
              <div className="pl-4">
                <h3 className="font-bold text-xl mb-4 text-green-600">
                  Datos Actuales
                </h3>
                <p className="mb-2">
                  <strong className="text-gray-700">Peso actual:</strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[clientStats.length - 1].weight} kg
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Grasa corporal:</strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[clientStats.length - 1].bodyFat}%
                  </span>
                </p>
                <p className="mb-2">
                  <strong className="text-gray-700">Masa muscular:</strong>{" "}
                  <span className="text-gray-900">
                    {clientStats[clientStats.length - 1].muscleMass} kg
                  </span>
                </p>
              </div>
            </div>

            {/* Botón "Ver detalles" */}
            <Dialog>
              <DialogTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out border-none shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  Ver detalles
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl bg-white border border-gray-300 rounded-lg shadow-lg p-6">
                <DialogHeader>
                  <DialogTitle className="text-lg font-bold">
                    Historial de estados físicos
                  </DialogTitle>
                </DialogHeader>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fecha
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Peso (kg)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Grasa Corporal (%)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Masa Muscular (kg)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Altura (cm)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {clientStats.map((stat, index) => (
                        <tr key={index}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.date}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.weight}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.bodyFat}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.muscleMass}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {stat.height}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </DialogContent>
            </Dialog>

            {/* Botón para añadir estado actual */}
            <Dialog>
              <DialogTrigger asChild>
                <button className="ml-20 bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-300 ease-in-out border-none shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-300">
                  Añadir nuevo registro
                </button>
              </DialogTrigger>
              <DialogContent className="max-w-md bg-white p-4">
                <DialogTitle className="text-lg font-medium text-gray-900">
                  Nuevo registro de composición corporal
                </DialogTitle>
                <div className="mt-4">
                  <div>
                    <label
                      htmlFor="peso"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Peso (kg)
                    </label>
                    <input
                      type="number"
                      name="peso"
                      id="peso"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingresa tu peso"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="grasaCorporal"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Grasa corporal (%)
                    </label>
                    <input
                      type="number"
                      name="grasaCorporal"
                      id="grasaCorporal"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingresa tu porcentaje de grasa corporal"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="masaMuscular"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Masa muscular (kg)
                    </label>
                    <input
                      type="number"
                      name="masaMuscular"
                      id="masaMuscular"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingresa tu masa muscular"
                    />
                  </div>
                  <div className="mt-4">
                    <label
                      htmlFor="altura"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Altura (cm)
                    </label>
                    <input
                      type="number"
                      name="altura"
                      id="altura"
                      className="mt-1 p-2 w-full border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                      placeholder="Ingresa tu altura"
                    />
                  </div>
                  <div className="flex justify-end mt-4">
                    <button
                      type="submit"
                      className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Guardar
                    </button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <Apple className="w-6 h-6 mr-2 text-green-600" />
              Seguimiento de Calorías
            </h2>
            <div className="flex flex-col items-center mb-6">
              <div className="relative w-48 h-48">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  {/* Círculo de fondo */}
                  <circle
                    className="text-gray-200 stroke-current"
                    strokeWidth="10"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                  ></circle>

                  {/* Círculo de progreso */}
                  <circle
                    stroke={
                      caloriesConsumed > dailyCalorieGoal
                        ? "#f87171"
                        : "#3b82f6"
                    } // Rojo si se excede, azul si no
                    strokeWidth="10"
                    strokeLinecap="round"
                    cx="50"
                    cy="50"
                    r="40"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 *
                      Math.PI *
                      40 *
                      (1 - Math.min(caloriesConsumed / dailyCalorieGoal, 1))
                    }`}
                  ></circle>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-bold">
                    {Math.round(caloriesConsumed)}
                  </span>
                  <span className="text-sm">de {dailyCalorieGoal} kcal</span>
                </div>
              </div>
              <p className="mt-4 text-center">
                <span className="font-semibold">Calorías consumidas:</span>{" "}
                {Math.round(caloriesConsumed)} kcal
              </p>
              {caloriesConsumed > dailyCalorieGoal ? (
                <p className="text-red-600 text-center font-bold">
                  ¡Calorías excedidas!
                </p>
              ) : (
                <p className="text-center">
                  <span className="font-semibold">Calorías faltantes:</span>{" "}
                  {Math.round(dailyCalorieGoal - caloriesConsumed)} kcal
                </p>
              )}
            </div>
            <div className="space-y-4">
              {/* Select con opciones visibles */}
              <Select onValueChange={setSelectedFood}>
                <SelectTrigger className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500">
                  <SelectValue placeholder="Selecciona un alimento" />
                </SelectTrigger>
                <SelectContent className="bg-white border border-gray-300 rounded-lg shadow-lg">
                  {foodDatabase.map((food, index) => (
                    <SelectItem
                      key={index}
                      value={food.name}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {food.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Input para cantidad en gramos */}
              <Input
                type="number"
                placeholder="Cantidad (gramos)"
                value={foodAmount}
                onChange={(e) => setFoodAmount(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500"
              />

              {/* Botón estilizado */}
              <Button
                onClick={handleAddFood}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200 ease-in-out disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!selectedFood || parseFloat(foodAmount) <= 0}
              >
                Añadir Alimento
              </Button>
            </div>
          </div>
        </div>
      </main>

      <FooterPag />
    </div>
  );
}
