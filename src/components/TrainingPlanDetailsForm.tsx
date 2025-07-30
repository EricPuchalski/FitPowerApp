import React from "react";

export interface TrainingPlanDetailsFormProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  errors?: { [field: string]: string };
  disabled?: boolean;
}

const TrainingPlanDetailsForm: React.FC<TrainingPlanDetailsFormProps> = ({
  name,
  onChange,
  errors = {},
  disabled = false,
}) => (
  <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
    <div className="bg-cyan-50 rounded-t-lg p-4">
      <h2 className="text-lg font-semibold text-gray-900">
        Detalles del Plan
      </h2>
    </div>
    <div className="p-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Nombre del Plan *
        </label>
        <input
          type="text"
          name="name"
          value={name}
          onChange={onChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          placeholder="Ej: Plan de Fuerza - Principiante"
          disabled={disabled}
          required
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600">{errors.name}</p>
        )}
        {disabled && (
          <p className="mt-1 text-sm text-gray-500">
            Solo se puede modificar el nombre al crear el plan
          </p>
        )}
      </div>
    </div>
  </div>
);

export default TrainingPlanDetailsForm;