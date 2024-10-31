import type { Coordinator } from "../components/Modales/ModalRegistroCoordinadores";
const API_URL = import.meta.env.VITE_API_URL;

// Función para crear un coordinador
export const createCoordinator = async (
  userId: string,
  coordinator: Coordinator
) => {
  try {
    const response = await fetch(`${API_URL}coordinador/create/${userId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(coordinator),
    });

    if (!response.ok) {
      throw new Error("Error al crear el coordinador");
    }

    return await response.json();
  } catch (error) {
    console.error("Error en createCoordinator:", error);
    return error;
  }
};

// Función para actualizar un coordinador
export const updateCoordinator = async (
  id: string,
  userId: string,
  coordinator: Coordinator
) => {
  try {
    const response = await fetch(
      `${API_URL}coordinador/update/${id}/${userId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coordinator),
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

// Función para buscar un coordinador por ID
export const findCoordinatorById = async (id: string) => {
  try {
    const response = await fetch(`${API_URL}coordinador/find/${id}`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};

// Función para eliminar un coordinador
export const deleteCoordinator = async (id: string, userId: string) => {
  try {
    const response = await fetch(
      `${API_URL}coordinador/delete/${id}/${userId}`,
      {
        method: "DELETE",
      }
    );
    return await response.json();
  } catch (error) {
    return error;
  }
};

// Función para obtener las ciudades con sus coordinadores
export const getCitiesWithCoordinators = async () => {
  try {
    const response = await fetch(`${API_URL}coordinador/select/cities`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};

export const getAllCoordinators = async () => {
  try {
    const response = await fetch(`${API_URL}coordinador/all`, {
      method: "GET",
    });
    return await response.json();
  } catch (error) {
    return error;
  }
};
