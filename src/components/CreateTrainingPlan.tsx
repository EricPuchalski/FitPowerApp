import React from 'react';
import Swal from 'sweetalert2'; // Asegúrate de instalar sweetalert2
import { Button } from "../../components/ui/button"; // Asegúrate de importar el componente Button

const CreateNewTrainingPlan = ({ clientDni }) => {
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
          html:
            '<input id="name" class="swal2-input" placeholder="Nombre del plan">' +
            '<input id="description" class="swal2-input" placeholder="Descripción del plan">',
          focusConfirm: false,
          preConfirm: () => {
            const name = Swal.getPopup().querySelector('#name').value;
            const description = Swal.getPopup().querySelector('#description').value;
            if (!name || !description) {
              Swal.showValidationMessage(`Por favor, ingresa el nombre y la descripción del plan.`);
            }
            return { name, description };
          }
        }).then((result) => {
          if (result.isConfirmed) {
            const { name, description } = result.value;
            fetch(`http://localhost:8080/api/training-plans`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                name,
                description,
                clientDni,
                active: true, // Asegúrate de que el nuevo plan esté activo
              }),
            })
              .then((response) => {
                if (response.ok) {
                  Swal.fire('Creado', 'El nuevo plan de entrenamiento ha sido creado.', 'success');
                  window.location.reload()
                  // Aquí puedes actualizar el estado o hacer cualquier otra cosa necesaria
                } else {
                  throw new Error('Error al crear el plan de entrenamiento');
                }
              })
              .catch((error) => {
                console.error("Error creating training plan:", error);
                Swal.fire('Error', 'Hubo un problema al crear el plan de entrenamiento.', 'error');
              });
          }
        });
      }
    });
  };

  return (
    <Button
      asChild
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
