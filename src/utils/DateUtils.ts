//FUNCION PARA OBTENER EL DIA SEGUN LA FECHA
export const getDayName = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return (
        date
          .toLocaleDateString("es-ES", {
            weekday: "long",
            timeZone: "UTC",
          })
          .charAt(0)
          .toUpperCase() +
        date
          .toLocaleDateString("es-ES", {
            weekday: "long",
            timeZone: "UTC",
          })
          .slice(1)
      );
    } catch (e) {
      console.error("Error obteniendo día:", dateString, e);
      return dateString;
    }
  };

// Función para obtener el rango de la semana (Lunes a Domingo)
export const getWeekRange = (weekOffset: number) => {
  const now = new Date();
  now.setDate(now.getDate() + weekOffset * 7);

  // Ajustar para que la semana empiece en domingo (0) y termine en sábado (6)
  const startOfWeek = new Date(now);
  startOfWeek.setDate(now.getDate() - now.getDay()); // Restamos el día actual para llegar al domingo

  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6); // Añadimos 6 días para llegar al sábado

  return { startOfWeek, endOfWeek };
};

  // Función para formatear fecha
  export const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        timeZone: "UTC",
      });
    } catch (e) {
      console.error("Error formateando fecha:", dateString, e);
      return dateString;
    }
  };

// Función para formatear el rango de la semana
export const formatWeekRange = (currentWeekOffset: number) => {
  const { startOfWeek, endOfWeek } = getWeekRange(currentWeekOffset);
  return `${formatDate(startOfWeek.toISOString())} - ${formatDate(endOfWeek.toISOString())}`;
};
