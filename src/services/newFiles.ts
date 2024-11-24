const API_URL = import.meta.env.VITE_API_URL;

export interface FileData {
  _id: string;
  nombre_carpeta: string;
  status: boolean;
  created_at: string;
  updated_at: string;
  ruta_archivos: string[];
}

export interface FolderInfo {
  _id: string;
  created_at: string;
  nombre_carpeta: string;
  ruta_archivos: string[];
  status: boolean;
  updated_at: string;
}

export async function createFolder(folderName: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}users/archivos/crear/carpeta`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nombre_carpeta: folderName }),
    });

    if (!response.ok) {
      const errorResponse = await response.json();
      throw new Error(errorResponse.error || "Error al crear la carpeta");
    }
  } catch (error) {
    console.error("Error al crear la carpeta", error);
    throw error;
  }
}

export async function uploadFileToFolder(
  folderId: string,
  file: File
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("archivo", file);

    const response = await fetch(
      `${API_URL}users/subida/archivos/generales/${folderId}`,
      {
        method: "POST",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Error al subir el archivo");
    }
  } catch (error) {
    console.error("Error al subir el archivo", error);
    throw error;
  }
}

export interface GetAllFilesResponse {
  result: boolean;
  error: string;
  data: FileData[];
}

export async function getAllFiles(): Promise<GetAllFilesResponse> {
  try {
    const response = await fetch(`${API_URL}users/buscar/archivos/generales`, {
      method: "GET",
    });

    if (!response.ok) {
      throw new Error("Error al obtener todos los archivos");
    }

    const data = await response.json();
    return data as GetAllFilesResponse;
  } catch (error) {
    console.error("Error al obtener todos los archivos", error);
    throw error;
  }
}

export async function getFolderInfo(folderId: string): Promise<FolderInfo> {
    try {
      const response = await fetch(`${API_URL}users/buscar/archivos/generales/${folderId}`);
      if (!response.ok) {
        throw new Error("Error al obtener la información de la carpeta");
      }
      const { data } = await response.json();
      return data;
    } catch (error) {
      console.error("Error al obtener la información de la carpeta", error);
      throw error;
    }
  }
  

export async function deleteFolder(folderId: string): Promise<void> {
  try {
    const response = await fetch(
      `${API_URL}users/elimina/carpeta/general/${folderId}`,
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      throw new Error("Error al eliminar la carpeta");
    }
  } catch (error) {
    console.error("Error al eliminar la carpeta", error);
    throw error;
  }
}

export async function searchFilesByNameOrPath(
  name: string
): Promise<FileData[]> {
  try {
    const response = await fetch(
      `${API_URL}users/buscar/archivos/generales/por/nombre/${name}`,
      {
        method: "GET",
      }
    );

    if (!response.ok) {
      throw new Error("Error al buscar archivos por nombre o ruta");
    }

    const data = await response.json();
    return data as FileData[];
  } catch (error) {
    console.error("Error al buscar archivos por nombre o ruta", error);
    throw error;
  }
}

export async function deleteFileByPath(filePath: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}users/elimina/archivo/general`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ ruta_archivo: filePath }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el archivo");
    }
  } catch (error) {
    console.error("Error al eliminar el archivo", error);
    throw error;
  }
}
