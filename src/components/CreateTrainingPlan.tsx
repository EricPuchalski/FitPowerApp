// src/components/CreateTrainingPlan.tsx
import React from 'react';
import Swal from 'sweetalert2';
import { Button } from "../../components/ui/button";

type CreateNewTrainingPlanProps = {
  clientId: number; // ✅ Usamos el ID real, no el DNI
};

const CreateNewTrainingPlan: React.FC<CreateNewTrainingPlanProps> = ({ clientId }) => {
  const handleCreatePlan = async () => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Crear uno nuevo implica desechar el actual.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, crear nuevo plan',
      cancelButtonText: 'Cancelar'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const { value: formValues } = await Swal.fire({
          title: 'Crear Nuevo Plan',
          html: '<input id="name" class="swal2-input" placeholder="Nombre del plan">',
          focusConfirm: false,
          preConfirm: () => {
            const name = (Swal.getPopup()?.querySelector('#name') as HTMLInputElement)?.value;
            if (!name) {
              Swal.showValidationMessage(`Por favor, ingresa el nombre del plan.`);
            }
            return { name };
          }
        });

        if (!formValues) return;

        const { name } = formValues;
        const dni = localStorage.getItem("userDni");
        const token = localStorage.getItem("token");

        if (!dni || !token) {
          Swal.fire('Error', 'No se encontró el DNI del entrenador o el token.', 'error');
          return;
        }

        try {
          // Obtener el trainerId desde el endpoint con DNI
          const trainerResponse = await fetch(`http://localhost:8080/api/v1/trainers/${dni}`, {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json'
            }
          });

          if (!trainerResponse.ok) {
            const errorText = await trainerResponse.text();
            throw new Error(errorText || "No se pudo obtener el entrenador");
          }

          const trainer = await trainerResponse.json();
          const trainerId = trainer.id;

          // Crear el plan de entrenamiento
          const createResponse = await fetch(`http://localhost:8080/api/v1/training-plans`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              name,
              trainerId,
              clientId,
            }),
          });

          if (createResponse.ok) {
            Swal.fire('Creado', 'El nuevo plan de entrenamiento ha sido creado.', 'success');
            window.location.reload();
          } else {
            const errorText = await createResponse.text();
            throw new Error(errorText || 'Error al crear el plan de entrenamiento');
          }

        } catch (error) {
          console.error("❌ Error creando el plan:", error);
          Swal.fire('Error', 'Hubo un problema al crear el plan de entrenamiento.', 'error');
        }
      }
    });
  };

  return (
    <Button
      variant="outline"
      className="flex items-center space-x-2 bg-green-500 text-white hover:bg-green-600"
      onClick={handleCreatePlan}
    >
      <div className="flex items-center space-x-2">
        <span>Crear Nuevo Plan</span>
      </div>
    </Button>
  );
};

export default CreateNewTrainingPlan;