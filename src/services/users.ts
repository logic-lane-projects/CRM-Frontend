// src/services/users.ts
export interface User {
  id: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  cellphone: string;
  city: string;
  role: string;
  state: string;
  permisos: string[];
  oficinas_permitidas: string[];
}

export interface UserResponse {
  data: {
    id: string;
    name: string;
    paternal_surname: string;
    maternal_surname: string;
    email: string;
    cellphone: string;
    city: string;
    role: string;
    state: string;
    permisos: string[];
    oficinas_permitidas: string[];
  };
}

const API_URL = import.meta.env.VITE_API_URL;

// Obtener todos los usuarios
export const getUsers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}users`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }
    const users: User[] = await response.json();
    return users;
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

export const getSellers = async (): Promise<User[]> => {
  try {
    const response = await fetch(`${API_URL}users/vendedores/con/oficina`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener usuarios");
    }

    const responseData = await response.json();

    if (!responseData.result || !Array.isArray(responseData.data)) {
      throw new Error("La respuesta no tiene el formato esperado");
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return responseData.data.map((user: any) => ({
      id: user._id,
      name: user.name,
      paternal_surname: user.paternal_surname || "",
      maternal_surname: user.maternal_surname || "",
      email: user.email,
      cellphone: user.cellphone || "",
      city: user.city || "",
      role: user.role || "",
      state: user.state || "",
      permisos: user.permisos || [],
      oficinas_permitidas: user.oficinas_permitidas || [],
    }));
  } catch (error) {
    console.error("Error al obtener los usuarios:", error);
    throw error;
  }
};

// Obtener un usuario por ID
export const getUserById = async (id: string): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}users/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener el usuario con ID ${id}`);
    }
    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error(`Error al obtener el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Actualizar usuario
export const updateUser = async (id: string, userData: User): Promise<User> => {
  try {
    const response = await fetch(`${API_URL}users/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error al actualizar el usuario con ID ${id}`);
    }

    const updatedUser: User = await response.json();
    return updatedUser;
  } catch (error) {
    console.error(`Error al actualizar el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar un usuario
export const deleteUser = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}users/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el usuario con ID ${id}`);
    }
    console.log(`Usuario con ID ${id} eliminado`);
  } catch (error) {
    console.error(`Error al eliminar el usuario con ID ${id}:`, error);
    throw error;
  }
};

// Crear un nuevo usuario
export const createUser = async (userData: User): Promise<User> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify({
    name: userData.name,
    paternal_surname: userData.paternal_surname,
    maternal_surname: userData.maternal_surname,
    email: userData.email,
    cellphone: userData.cellphone,
    city: userData.city,
    role: userData.role,
  });

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect,
  };

  try {
    const response = await fetch(`${API_URL}users`, requestOptions);
    if (!response.ok) {
      throw new Error("Error al crear el usuario");
    }
    const newUser: User = await response.json();
    return newUser;
  } catch (error) {
    console.error("Error al crear un nuevo usuario:", error);
    throw error;
  }
};

export const assignSeller = async (
  userId: string,
  sellerId: string,
  leadIds: string[]
) => {
  try {
    const response = await fetch(`${API_URL}change/assigned_to/${userId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id_vendedor: sellerId,
        leads: leadIds,
      }),
    });

    if (!response.ok) {
      throw new Error("Error assigning lead to seller");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in assignSeller:", error);
    throw error;
  }
};

export const getLeadsBySellerAndRole = async (
  sellerId: string,
  role: string
) => {
  try {
    const response = await fetch(
      `${API_URL}client/buscar_leads_por_vendedor_y_tipo_client/all/${sellerId}/${role}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error fetching leads assigned to seller");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in getLeadsBySellerAndRole:", error);
    throw error;
  }
};
