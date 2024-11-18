const API_URL = import.meta.env.VITE_API_URL;
// Subir archivo
export const uploadMarketingFile = async (idVendedor: string, file: File) => {
  const formData = new FormData();
  formData.append('archivo', file);

  try {
    const response = await fetch(`${API_URL}users/subida/archivos/marketing/${idVendedor}`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al subir el archivo');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error al subir el archivo');
    } else {
      throw new Error('Error desconocido al subir el archivo');
    }
  }
};

// Buscar todos los archivos de marketing
export const getAllMarketingFiles = async () => {
  try {
    const response = await fetch(`${API_URL}users/buscar/archivos/marketing`);
    
    if (!response.ok) {
      throw new Error('Error al obtener los archivos');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error al obtener los archivos');
    } else {
      throw new Error('Error desconocido al obtener los archivos');
    }
  }
};

// Buscar archivo por ID
export const getMarketingFileById = async (idArchivo: string) => {
  try {
    const response = await fetch(`${API_URL}users/buscar/archivos/marketing/${idArchivo}`);
    
    if (!response.ok) {
      throw new Error('Error al obtener el archivo');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error al obtener el archivo');
    } else {
      throw new Error('Error desconocido al obtener el archivo');
    }
  }
};

// Eliminar archivo por ID
export const deleteMarketingFile = async (idArchivo: string) => {
  try {
    const response = await fetch(`${API_URL}users/buscar/archivos/marketing/${idArchivo}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error('Error al eliminar el archivo');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error al eliminar el archivo');
    } else {
      throw new Error('Error desconocido al eliminar el archivo');
    }
  }
};

// Buscar archivo por nombre
export const searchMarketingFileByName = async (nombreArchivo: string) => {
  try {
    const response = await fetch(`${API_URL}users/buscar/archivos/marketing/por/nombre/${nombreArchivo}`);
    
    if (!response.ok) {
      throw new Error('Error al buscar el archivo por nombre');
    }

    const data = await response.json();
    return data;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw new Error(error.message || 'Error al buscar el archivo por nombre');
    } else {
      throw new Error('Error desconocido al buscar el archivo por nombre');
    }
  }
};
