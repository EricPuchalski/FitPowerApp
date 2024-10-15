# Gym Management System

Este proyecto es una aplicación de gestión para un gimnasio, diseñada para facilitar la administración de clientes, rutinas de ejercicio, planes de nutrición y la interacción entre entrenadores, nutricionistas y clientes. El sistema incluye varios roles con funcionalidades específicas para cada uno.

## Roles del Sistema

### 1. **Administrador**
El administrador tiene acceso completo al sistema y es responsable de:
- Gestionar usuarios (crear, editar y eliminar clientes, entrenadores, nutricionistas).
- Asignar entrenadores y nutricionistas a los clientes.
- Controlar y supervisar todas las operaciones del gimnasio.

### 2. **Entrenador**
El entrenador gestiona las rutinas de ejercicios de los clientes:
- Crear y personalizar rutinas de entrenamiento para cada cliente.
- Evaluar el progreso físico de los clientes.
- Ajustar los entrenamientos según el avance o necesidades del cliente.

### 3. **Nutricionista**
El nutricionista se encarga de los planes de nutrición para los clientes:
- Crear planes de alimentación personalizados.
- Monitorear y ajustar la dieta de los clientes según sus objetivos.
- Consultar el progreso de los clientes y realizar modificaciones en su plan nutricional.

### 4. **Cliente**
Los clientes pueden:
- Consultar su rutina de ejercicios asignada.
- Revisar su plan de alimentación.
- Registrar su progreso diario (peso, repeticiones, alimentos consumidos).
- Comunicarse con su entrenador y nutricionista.

## Funcionalidades Principales

- **Gestión de Clientes**: Los administradores pueden agregar, editar y eliminar clientes, asignarles entrenadores y nutricionistas.
- **Gestión de Rutinas de Ejercicio**: Los entrenadores pueden crear y modificar rutinas de entrenamiento para los clientes.
- **Gestión de Planes Nutricionales**: Los nutricionistas pueden crear planes alimenticios personalizados, ajustarlos según los progresos de los clientes.
- **Registro de Progreso**: Los clientes pueden registrar su progreso diario, tanto en sus entrenamientos como en su nutrición.
- **Evaluación y Ajuste**: Entrenadores y nutricionistas pueden revisar el rendimiento de los clientes y hacer ajustes a sus rutinas o dietas.
- **Comunicación**: Los clientes pueden interactuar con sus entrenadores y nutricionistas a través de la plataforma.

## Tecnologías Utilizadas

- **Backend**: Spring Boot
- **Frontend**: React
- **Base de Datos**: MySQL
- **Autenticación**: Spring Security
- **Interacción entre Cliente y Servidor**: API REST
