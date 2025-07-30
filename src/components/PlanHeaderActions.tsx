import React from "react";
import { ArrowLeft, Save } from "lucide-react";

export interface PlanHeaderActionsProps {
  title: string;
  onSave: () => void;
  onBack: () => void;
  isSaving?: boolean;
  isNewPlan?: boolean;
  isEditingExercise?: boolean;
}

const PlanHeaderActions: React.FC<PlanHeaderActionsProps> = ({ 
  title, 
  onSave, 
  onBack, 
  isSaving = false,
  isNewPlan = false,
  isEditingExercise = false
}) => {
  const shouldShowSaveButton = isNewPlan || (!isNewPlan && !isEditingExercise);

  return (
    <div className="flex items-center justify-between mb-8">
      <div className="flex items-center space-x-4">
        <button
          onClick={onBack}
          className="flex items-center space-x-2 px-3 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Volver</span>
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900">
          {title}
        </h1>
      </div>

      {shouldShowSaveButton && (
        <button
          onClick={onSave}
          disabled={isSaving}
          className="bg-pink-400 hover:bg-pink-500 text-white px-4 py-2 rounded-md flex items-center space-x-2 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          <span>{isSaving ? "Guardando..." : "Guardar Plan"}</span>
        </button>
      )}
    </div>
  );
};

export default PlanHeaderActions;