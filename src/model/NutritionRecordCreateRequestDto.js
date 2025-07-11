// Funciones de validación para replicar las validaciones de Java
export const validateNutritionRecordRequest = (data) => {
    const errors = [];
    // Validación calories
    if (data.calories === null || data.calories === undefined) {
        errors.push("Calories cannot be null");
    }
    else if (data.calories < 0) {
        errors.push("Calories must be zero or positive");
    }
    // Validación proteins
    if (data.proteins === null || data.proteins === undefined) {
        errors.push("Proteins cannot be null");
    }
    else if (data.proteins < 0) {
        errors.push("Proteins must be zero or positive");
    }
    // Validación fats
    if (data.fats === null || data.fats === undefined) {
        errors.push("Fats cannot be null");
    }
    else if (data.fats < 0) {
        errors.push("Fats must be zero or positive");
    }
    // Validación carbohydrates
    if (data.carbohydrates === null || data.carbohydrates === undefined) {
        errors.push("Carbohydrates cannot be null");
    }
    else if (data.carbohydrates < 0) {
        errors.push("Carbohydrates must be zero or positive");
    }
    // Validación food
    if (!data.food || data.food.trim() === "") {
        errors.push("Food cannot be blank");
    }
    // Validación mealTime
    if (data.mealTime === null || data.mealTime === undefined) {
        errors.push("Meal time cannot be null");
    }
    return errors;
};
// Tipo guard para verificar si un objeto es un NutritionRecordRequestDto válido
export const isValidNutritionRecordRequest = (data) => {
    return validateNutritionRecordRequest(data).length === 0;
};
