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
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
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
        }).then((result) => {
          if (result.isConfirmed) {
            const { name } = result.value!;
            
            // ⚠️ Usa la clave correcta según como guardaste el ID
            const trainerId = Number(localStorage.getItem("trainerId")); 
            const token = localStorage.getItem("token");

            if (!trainerId || !token) {
              Swal.fire('Error', 'No se encontró el ID del entrenador o el token.', 'error');
              return;
            }

            // ✅ CORREGIDO: Ruta correcta del backend
            fetch(`http://localhost:8080/api/v1/training-plans`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
              },
              body: JSON.stringify({
                name,
                trainerId,
                clientId
              }),
            })
              .then((response) => {
                if (response.ok) {
                  Swal.fire('Creado', 'El nuevo plan de entrenamiento ha sido creado.', 'success');
                  window.location.reload();
                } else {
                  // Si no fue exitoso, intenta obtener el texto de error
                  return response.text().then(text => {
                    throw new Error(text || 'Error al crear el plan de entrenamiento');
                  });
                }
              })
              .catch((error) => {
                console.error("❌ Error creando el plan:", error);
                Swal.fire('Error', 'Hubo un problema al crear el plan de entrenamiento.', 'error');
              });
          }
        });
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
// src/components/CreateTrainingPlan.tsx