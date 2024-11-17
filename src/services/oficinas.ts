const APP_URL = import.meta.env.VITE_API_URL as string;

export interface OfficeData {
  _id: string;
  nombre: string;
  ciudad: string;
  estado: string;
  numero_telefonico: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface ApiResponse<T> {
  result: boolean;
  error: string;
  data: T;
}

const handleFetchError = <T>(error: unknown, emptyData: T): ApiResponse<T> => ({
  result: false,
  error: error instanceof Error ? error.message : "Error desconocido",
  data: emptyData,
});

export const getAllOffices = async (): Promise<ApiResponse<OfficeData[]>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/find_all`);
    if (!response.ok) {
      const error = await response.json();
      return { result: false, error: error.message, data: [] };
    }
    return response.json();
  } catch (error) {
    return handleFetchError(error, []);
  }
};

export const createOffice = async (
  userId: string,
  officeData: Omit<OfficeData, "_id" | "created_at" | "updated_at" | "status">
): Promise<ApiResponse<OfficeData | null>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/create/${userId}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: officeData.nombre,
        ciudad: officeData.ciudad,
        estado: officeData.estado,
        numero_telefonico: officeData.numero_telefonico,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      return { result: false, error: error.message, data: null };
    }
    return response.json();
  } catch (error) {
    return handleFetchError(error, null);
  }
};

export const getOfficeById = async (officeId: string): Promise<ApiResponse<OfficeData | null>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/find/${officeId}`);
    if (!response.ok) {
      const error = await response.json();
      return { result: false, error: error.message, data: null };
    }
    return response.json();
  } catch (error) {
    return handleFetchError(error, null);
  }
};

export const updateOffice = async (
  officeId: string,
  userId: string,
  officeData: Partial<Omit<OfficeData, "_id" | "created_at" | "updated_at">>
): Promise<ApiResponse<OfficeData | null>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/update/${officeId}/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: officeData.nombre,
        ciudad: officeData.ciudad,
        estado: officeData.estado,
        numero_telefonico: officeData.numero_telefonico,
        status: officeData.status,
      }),
    });
    if (!response.ok) {
      const error = await response.json();
      return { result: false, error: error.message, data: null };
    }
    return response.json();
  } catch (error) {
    return handleFetchError(error, null);
  }
};

export const deleteOffice = async (officeId: string, userId: string): Promise<ApiResponse<null>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/delete/${officeId}/${userId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      const error = await response.json();
      return { result: false, error: error.message, data: null };
    }
    return { result: true, error: "", data: null };
  } catch (error) {
    return handleFetchError(error, null);
  }
};

export const getOfficesByCity = async (city: string): Promise<ApiResponse<OfficeData[]>> => {
  try {
    const response = await fetch(`${APP_URL}/oficinas/find/all/city/${city}`);
    return response.json();
  } catch (error) {
    return { result: false, error: error as string, data: [] };
  }
};
