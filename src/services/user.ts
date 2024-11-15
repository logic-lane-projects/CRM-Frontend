// services/userService.ts
export interface User {
  _id?: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  cellphone: string;
  oficinas_permitidas: string[];
  city: string;
  state: string;
  permisos: string[];
  role: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Función para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
};

// Crear un usuario
export const createUser = async (userData: User): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const responseData = await response.json();

    if (!response.ok) {
      const errorMessage = responseData.message || "Error al crear el usuario";
      const errorDetail = responseData.error ? `: ${responseData.error}` : "";
      throw new Error(`${errorMessage}${errorDetail}`);
    }

    return { success: true, data: responseData };
  } catch (error) {
    return { success: false, message: handleError(error) };
  }
};



// Obtener todos los usuarios
export const getAllUsers = async (): Promise<ApiResponse<User[]>> => {
  try {
    const response = await fetch(`${API_URL}/users`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw handleError(error);
  }
};

// Obtener usuario por ID
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw handleError(error);
  }
};

// Actualizar usuario
export const updateUser = async (
  id: string,
  userData: User
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw handleError(error);
  }
};

// Eliminar usuario
export const deleteUser = async (id: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
    });
    return { success: response.ok };
  } catch (error) {
    throw handleError(error);
  }
};

// Buscar usuario por email
export const getUserByEmail = async (email: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}/users/find/email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw handleError(error);
  }
};
