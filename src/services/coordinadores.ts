const API_URL = import.meta.env.VITE_API_URL;

// funcion para crear un coordinador
export const createCoordinator = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    return response.json;
  } catch (error) {
    return error;
  }
};

// Funcion para editar un coordinador
export const updateCoordinator = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    return response.json();
  } catch (error) {
    return error;
  }
};

// Funcion para encontrar un coordinador por id
export const findCoordinatorById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}/${id}`);
    return response.json();
  } catch (error) {
    return error;
  }
};

// Funcion para encontrar todos los coordinadores
export const getAllCoordinators = async () => {
  try {
    const response = await fetch(`${API_URL}`);
    return response.json;
  } catch (error) {
    return error;
  }
};
