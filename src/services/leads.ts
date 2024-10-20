// src/services/leads.ts
export interface Lead {
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

// Crear un nuevo lead
export const createLead = async (leadData: Lead): Promise<Lead> => {
  const myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  const raw = JSON.stringify(leadData);

  const requestOptions: RequestInit = {
    method: "POST",
    headers: myHeaders,
    body: raw,
    redirect: "follow" as RequestRedirect,
  };

  try {
    const response = await fetch(`${API_URL}leads`, requestOptions);

    // Si la respuesta no es exitosa, intenta leer el cuerpo del error
    if (!response.ok) {
      const errorResponse = await response.json(); // Capturar el cuerpo de la respuesta con los errores
      throw new Error(JSON.stringify(errorResponse)); // Lanzar el error con los detalles
    }

    const newLead: Lead = await response.json();
    return newLead;
  } catch (error) {
    console.error("Error al crear un nuevo lead:", error);
    throw error;
  }
};


// Obtener un lead por ID
export const getLeadById = async (id: string): Promise<Lead> => {
  try {
    const response = await fetch(`${API_URL}leads/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener el lead con ID ${id}`);
    }

    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error(`Error al obtener el lead con ID ${id}:`, error);
    throw error;
  }
};

// Obtener un lead activo por ID
export const getActiveLeadById = async (id: string): Promise<Lead> => {
  try {
    const response = await fetch(`${API_URL}leads/active/${id}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener el lead activo con ID ${id}`);
    }
    const lead: Lead = await response.json();
    return lead;
  } catch (error) {
    console.error(`Error al obtener el lead activo con ID ${id}:`, error);
    throw error;
  }
};

// Obtener todos los leads (borrados y no borrados)
export const getAllLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_URL}leads`, {
      method: "GET",
    });
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error("Error al obtener los leads:", error);
    throw error;
  }
};

// Obtener todos los leads activos
export const getActiveLeads = async (): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_URL}leads/actives`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Error al obtener los leads activos");
    }
    const leads: Lead[] = await response.json();
    return leads;
  } catch (error) {
    console.error("Error al obtener los leads activos:", error);
    throw error;
  }
};

// Buscar leads activos por email
export const getLeadsByEmail = async (email: string): Promise<Lead[]> => {
  try {
    const response = await fetch(`${API_URL}/leads/email/${email}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error(`Error al obtener los leads con email ${email}`);
    }
    const leads: Lead[] = await response.json();
    return leads;
  } catch (error) {
    console.error(`Error al obtener los leads con email ${email}:`, error);
    throw error;
  }
};

// Buscar leads activos por teléfono
export const getLeadsByPhoneNumber = async (
  phoneNumber: string
): Promise<Lead[]> => {
  try {
    const response = await fetch(
      `${API_URL}/leads/phone_number/${phoneNumber}`,
      {
        method: "GET",
      }
    );
    if (!response.ok) {
      throw new Error(
        `Error al obtener los leads con número de teléfono ${phoneNumber}`
      );
    }
    const leads: Lead[] = await response.json();
    return leads;
  } catch (error) {
    console.error(
      `Error al obtener los leads con número de teléfono ${phoneNumber}:`,
      error
    );
    throw error;
  }
};

// Editar lead
export const updateLead = async (id: string, leadData: Lead): Promise<Lead> => {
  try {
    const response = await fetch(`${API_URL}leads/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(leadData),
    });

    if (!response.ok) {
      // Capturar el error en formato JSON si la respuesta no es correcta
      const errorResponse = await response.json();
      // Lanzar un nuevo error con la información recibida
      throw new Error(JSON.stringify(errorResponse));
    }

    const updatedLead: Lead = await response.json();
    return updatedLead;
  } catch (error) {
    console.error(`Error al actualizar el lead con ID ${id}:`, error);
    throw error;
  }
};

// Eliminar lead
export const deleteLead = async (id: string): Promise<void> => {
  try {
    const response = await fetch(`${API_URL}leads/${id}`, {
      method: "DELETE",
    });
    if (!response.ok) {
      throw new Error(`Error al eliminar el lead con ID ${id}`);
    }
    console.log(`Lead con ID ${id} eliminado`);
  } catch (error) {
    console.error(`Error al eliminar el lead con ID ${id}:`, error);
    throw error;
  }
};

export const changeLeadToProspect = async (id?: string | number): Promise<void> => {
  try {
    const response = await fetch(
      `${API_URL}client/change/customer_prospectus/${id}`,
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
