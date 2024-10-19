// src/services/clientes.ts
export interface Buyer {
  _id?: string | undefined;
  names: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  phone_number: string;
  age: number;
  birthday_date: string;
  city: string | null;
  state: string | null;
  status?: string | null;
  type_lead: string;
  gender: "MALE" | "FEMALE" | null;
  is_client: boolean | null;
  created_at?: string;
  updated_at?: string;
}

const API_URL = import.meta.env.VITE_API_URL;

// Consultar clientes activos
export const getActiveBuyers = async (): Promise<{
  result: boolean;
  error: string;
  data: Buyer[];
}> => {
  try {
    const response = await fetch(
      `${API_URL}buyer/active
  `,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error("Error al obtener los pre-clientes activos");
    }
    const jsonResponse = await response.json(); // Parsear la respuesta como JSON
    return jsonResponse; // Devolver el objeto completo con result, error y data
  } catch (error) {
    console.error("Error al obtener los clientes activos:", error);
    throw error;
  }
};

export const getBuyerById = async (
  id: string
): Promise<{ result: boolean; error: string; data: Buyer }> => { 
  try {
    const response = await fetch(`${API_URL}buyer/active/${id}`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener los datos del cliente");
    }

    const jsonResponse = await response.json();
    return jsonResponse; // Asegurarse de que `data` es un objeto `Client`
  } catch (error) {
    console.error("Error al obtener la información del cliente", error);
    throw error;
  }
};

export const changeProspectToClient = async (id?: string | number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}client/change/client/${id}`,
      {
        method: "PATCH",
      }
    );
    if (!response.ok) {
      throw new Error("Error al pasar el lead a prospecto");
    }
    console.log("El lead se hizo cliente existosamente");
  } catch (error) {
    console.error("Error al pasar el lead a prospecto", error);
    throw error;
  }
};

