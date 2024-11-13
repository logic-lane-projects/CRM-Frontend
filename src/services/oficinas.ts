const APP_URL = import.meta.env.VITE_API_URL as string;

export interface OfficeData {
  _id: string;
  oficina: string;
  ciudad: string;
  estado: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  result: boolean;
  error: string;
  data: T | null;
}

// Obtener todas las oficinas
export const getAllOffices = async (): Promise<ApiResponse<OfficeData[]>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/find_all`);
    return response.json();
  } catch (error) {
    return { result: false, error: error as string, data: [] };
  }
};

// Crear una oficina
export const createOffice = async (
    userId: string, 
    officeData: Omit<OfficeData, "_id" | "created_at" | "updated_at" | "status">
  ): Promise<ApiResponse<OfficeData>> => {
    try {
      const response = await fetch(`${APP_URL}oficinas/create/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          oficina: officeData.oficina,
          ciudad: officeData.ciudad,
          estado: officeData.estado,
        }),
      });
      return response.json();
    } catch (error) {
      return { result: false, error: error as string, data: null };
    }
  };
  

// Buscar una oficina por ID
export const getOfficeById = async (officeId: string): Promise<ApiResponse<OfficeData>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/find/${officeId}`);
    return response.json();
  } catch (error) {
    return { result: false, error: error as string, data: null };
  }
};

// Actualizar una oficina
export const updateOffice = async (
  officeId: string,
  userId: string,
  officeData: Partial<Omit<OfficeData, "_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<OfficeData>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/update/${officeId}/${userId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oficina: officeData.oficina,
        ciudad: officeData.ciudad,
        estado: officeData.estado,
        status: officeData.status,
      }),
    });
    return response.json();
  } catch (error) {
    return { result: false, error: error as string, data: null };
  }
};

// Eliminar una oficina
export const deleteOffice = async (officeId: string, userId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/delete/${officeId}/${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  } catch (error) {
    return { result: false, error: error as string, data: null };
  }
};

// Obtener todas las oficinas por ciudad
export const getOfficesByCity = async (city: string): Promise<ApiResponse<OfficeData[]>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/find/all/city/${city}`);
    return response.json();
  } catch (error) {
    return { result: false, error: error as string, data: [] };
  }
};
