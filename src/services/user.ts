// services/userService.ts
export interface User {
  _id?: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  cellphone: string;
  oficinas_permitidas?: string[];
  city: string;
  state: string;
  permisos?: string[];
  role: string;
  data?: {
    _id?: string;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
}

const API_URL = import.meta.env.VITE_API_URL;
const API_URL_TWILIO = import.meta.env.VITE_API_TWILIO_URL;

// Función para manejar errores
const handleError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return "Ocurrió un error desconocido";
};

// Crear un usuario
export const createUser = async (
  userData: User
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}users`, {
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
    const response = await fetch(`${API_URL}users`);
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw handleError(error);
  }
};

export const getUsersByOffice = async (
  officeId: string
): Promise<ApiResponse<PaginatedResponse<User>>> => {
  try {
    const response = await fetch(
      `${API_URL}users/buscar/por/oficina/${officeId}`
    );
    const data = await response.json();
    return { success: response.ok, data };
  } catch (error) {
    throw handleError(error);
  }
};

// Obtener usuario por ID
export const getUserById = async (id: string): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}users/${id}`);
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
    const response = await fetch(`${API_URL}users/${id}`, {
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
    const response = await fetch(`${API_URL}users/${id}`, {
      method: "DELETE",
    });
    return { success: response.ok };
  } catch (error) {
    throw handleError(error);
  }
};

// Buscar usuario por email
export const getUserByEmail = async (
  email: string
): Promise<ApiResponse<User>> => {
  try {
    const response = await fetch(`${API_URL}users/find/email`, {
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

// Funcion para actualizar los permisos
export const updatePermissions = async (
  id_admin: unknown,
  id_vendedor: unknown,
  permisos: unknown
) => {
  try {
    const response = await fetch(
      `${API_URL}users/asignar/permisos/${id_admin}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_vendedor,
          permisos,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error al asignar permisos");
    }

    return await response.json();
  } catch (error) {
    console.error(error);
    return error;
  }
};

export const updateOficinasPermitidas = async (
  idVendedor: string,
  selectedOffices: string[],
  idAdmin: string
) => {
  try {
    const response = await fetch(`${API_URL}users/asignar/oficina/${idAdmin}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_vendedor: idVendedor,
        oficinas: selectedOffices,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al actualizar las oficinas permitidas");
    }

    return response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(
        "Error al actualizar las oficinas permitidas:",
        error.message
      );
      return { error: error.message };
    }
    console.error("Error desconocido:", error);
    return { error: "Error desconocido" };
  }
};

export const assignSeller = async (
  userId: string,
  sellerId: string,
  leadIds: string[]
) => {
  try {
    const response = await fetch(
      `${API_URL}clientes/asignar/vendedor/${userId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id_vendedor: sellerId,
          clientes: leadIds,
        }),
      }
    );

    if (!response.ok) {
      throw new Error("Error assigning lead to seller");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in assignSeller:", error);
    throw error;
  }
};

export const msnToSeller = async (number: string, leadFolio: string) => {
  console.log(leadFolio)
  console.log("enviando mensaje");
  try {
    const response = await fetch(
      `${API_URL_TWILIO}/notication_assignament?To=${number}&lead_folio=${leadFolio}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    console.log(response);
    return response.json();
  } catch (error) {
    return error;
  }
};
