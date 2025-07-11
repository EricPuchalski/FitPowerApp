//src/pages/Client/NutritionProgressPage.tsx
import React from "react";
import { useParams } from "react-router-dom";
import { NutritionProgressSection } from "./NutritionProgressSection";

const NutritionProgressPage: React.FC = () => {
  //   /client/:dni/nutrition-progress  
  const { dni } = useParams<{ dni: string }>();

  if (!dni) return null; // por si la URL viene mal formada

  return (
    <main className="container mx-auto px-4 py-8">
      <NutritionProgressSection dni={dni} />
    </main>
  );
};

export default NutritionProgressPage;
