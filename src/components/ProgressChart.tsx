'use client'

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card";
import { ChartContainer } from "../../components/ui/chart";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend, Cell } from 'recharts';
import NavBarTrainer from './NavBarTrainer';
import { FooterPag } from './Footer';
import { motion } from 'framer-motion';

interface HealthMetrics {
  imc: number;
  bodyFatPercentage: number;
  muscleMass: number;
}

const getIMCCategory = (imc: number): string => {
  if (imc < 18.5) return 'Bajo peso';
  if (imc < 25) return 'Peso normal';
  if (imc < 30) return 'Sobrepeso';
  return 'Obesidad';
};

const getBodyFatCategory = (bodyFat: number, gender: 'male' | 'female'): string => {
  if (gender === 'male') {
    if (bodyFat < 6) return 'Esencial';
    if (bodyFat < 14) return 'Atleta';
    if (bodyFat < 18) return 'Fitness';
    if (bodyFat < 25) return 'Aceptable';
    return 'Obesidad';
  } else {
    if (bodyFat < 14) return 'Esencial';
    if (bodyFat < 21) return 'Atleta';
    if (bodyFat < 25) return 'Fitness';
    if (bodyFat < 32) return 'Aceptable';
    return 'Obesidad';
  }
};

const getMuscleMassCategory = (muscleMass: number, gender: 'male' | 'female'): string => {
  if (gender === 'male') {
    if (muscleMass < 33) return 'Bajo';
    if (muscleMass < 39) return 'Normal';
    if (muscleMass < 44) return 'Alto';
    return 'Muy alto';
  } else {
    if (muscleMass < 24) return 'Bajo';
    if (muscleMass < 31) return 'Normal';
    if (muscleMass < 36) return 'Alto';
    return 'Muy alto';
  }
};

export default function ProgressChart() {
  const { clientDni } = useParams<{ clientDni: string }>();
  const [metrics, setMetrics] = useState<HealthMetrics | null>(null);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token && clientDni) {
      const fetchMetrics = async () => {
        try {
          const [imcResponse, bodyFatResponse, muscleMassResponse] = await Promise.all([
            axios.get(`http://localhost:8080/api/clients/${clientDni}/imc`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            axios.get(`http://localhost:8080/api/clients/${clientDni}/body-fat-percentage`, {
              headers: { 'Authorization': `Bearer ${token}` }
            }),
            axios.get(`http://localhost:8080/api/clients/${clientDni}/muscle-mass`, {
              headers: { 'Authorization': `Bearer ${token}` }
            })
          ]);

          setMetrics({
            imc: imcResponse.data,
            bodyFatPercentage: bodyFatResponse.data,
            muscleMass: muscleMassResponse.data
          });
        } catch (error) {
          console.error('Error fetching metrics:', error);
        }
      };

      fetchMetrics();
    }
  }, [clientDni]);

  if (!metrics) {
    return <div>Cargando...</div>;
  }

  const chartData = [
    { name: 'IMC', value: metrics.imc, color: '#4CAF50', category: getIMCCategory(metrics.imc) },
    { name: 'Grasa Corporal', value: metrics.bodyFatPercentage, color: '#FFC107', category: getBodyFatCategory(metrics.bodyFatPercentage, gender) },
    { name: 'Masa Muscular', value: metrics.muscleMass, color: '#2196F3', category: getMuscleMassCategory(metrics.muscleMass, gender) }
  ];

  const chartConfig = {
    imc: {
      label: 'IMC',
      color: '#4CAF50',
    },
    bodyFatPercentage: {
      label: 'Grasa Corporal',
      color: '#FFC107',
    },
    muscleMass: {
      label: 'Masa Muscular',
      color: '#2196F3',
    },
  };

  const handleMouseEnter = (data: any, index: number) => {
    setActiveIndex(index);
  };

  const handleMouseLeave = () => {
    setActiveIndex(null);
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <NavBarTrainer />
      <Link to="/trainer/client/32423431/report" className="text-blue-500 hover:underline">
            Generar Informe del Cliente
          </Link>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="container mx-auto py-8"
      >
        <Card className="w-full max-w-4xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl font-bold text-gray-800">Evaluación del Progreso Físico</CardTitle>
            <CardDescription className="text-lg text-gray-600">Métricas de salud y composición corporal</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[400px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <XAxis dataKey="name" stroke="#888888" />
                  <YAxis stroke="#888888" />
                  <Tooltip
                    content={({ active, payload, label }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                            <p className="font-bold text-gray-800">{`${label} : ${payload[0].value.toFixed(2)}`}</p>
                            <p className="text-sm text-gray-600">{payload[0].payload.category}</p>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                  <Legend />
                  <Bar dataKey="value" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
                    {chartData.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={entry.color}
                        opacity={activeIndex === null || activeIndex === index ? 1 : 0.6}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              {chartData.map((metric, index) => (
                <motion.div
                  key={metric.name}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full">
                    <CardHeader style={{ backgroundColor: metric.color, color: 'white' }}>
                      <CardTitle className="text-2xl">{metric.name}</CardTitle>
                      <CardDescription className="text-white text-lg font-semibold">{metric.value.toFixed(2)}</CardDescription>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <p className="font-bold text-lg">Categoría: {metric.category}</p>
                      <p className="mt-2 text-sm text-gray-600">
                        {metric.name === 'IMC' && "El IMC es una medida de la relación entre el peso y la altura. Un IMC entre 18.5 y 24.9 se considera normal."}
                        {metric.name === 'Grasa Corporal' && "El porcentaje de grasa corporal es crucial para la salud. Los rangos óptimos varían según el género y la edad."}
                        {metric.name === 'Masa Muscular' && "La masa muscular es importante para el metabolismo y la fuerza. Los rangos ideales dependen del género y la actividad física."}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </motion.div>
      <FooterPag />
    </div>
  );
}