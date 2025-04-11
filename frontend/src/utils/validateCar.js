export const validateCar = (car) => {
  const newErrors = {};
  if (!car.make.trim()) {
    newErrors.make = "Make is required";
  }
  if (!car.model.trim()) {
    newErrors.model = "Model is required";
  }
  if (!car.year) {
    newErrors.year = "Year is required";
  } else {
    const yearNum = parseInt(car.year);
    const currentYear = new Date().getFullYear();
    if (yearNum < 1900 || yearNum > currentYear + 1) {
      newErrors.year = `Year must be between 1900 and ${currentYear + 1}`;
    }
  }
  return newErrors;
};