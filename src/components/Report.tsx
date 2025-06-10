// src/components/Report.tsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ReportChart from './ReportChart';

interface ReportResponseDto {
  bmiValues: number[];
  muscleMassValues: number[];
  bodyFatValues: number[];
}

const Report: React.FC = () => {
  const { clientDni } = useParams<{ clientDni: string }>();
  const [reportData, setReportData] = useState<ReportResponseDto | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication token not found');
      return;
    }

    fetch(`http://localhost:8080/api/clients/${clientDni}/report`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => setReportData(data))
      .catch(error => {
        console.error('Error:', error);
        setError('Failed to fetch report data');
      });
  }, [clientDni]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!reportData) {
    return <div>Loading...</div>;
  }

  const bmiData = {
    labels: reportData.bmiValues.map((_, index) => `Measurement ${index + 1}`),
    datasets: [
      {
        label: 'BMI',
        data: reportData.bmiValues,
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
    ],
  };

  const muscleMassData = {
    labels: reportData.muscleMassValues.map((_, index) => `Measurement ${index + 1}`),
    datasets: [
      {
        label: 'Muscle Mass',
        data: reportData.muscleMassValues,
        borderColor: 'rgba(153, 102, 255, 1)',
        backgroundColor: 'rgba(153, 102, 255, 0.2)',
      },
    ],
  };

  const bodyFatData = {
    labels: reportData.bodyFatValues.map((_, index) => `Measurement ${index + 1}`),
    datasets: [
      {
        label: 'Body Fat',
        data: reportData.bodyFatValues,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };

  return (
    <div>
      <h2>Client Report</h2>
      <ReportChart data={bmiData} title="BMI Comparison" />
      <ReportChart data={muscleMassData} title="Muscle Mass Comparison" />
      <ReportChart data={bodyFatData} title="Body Fat Comparison" />
    </div>
  );
};

export default Report;
