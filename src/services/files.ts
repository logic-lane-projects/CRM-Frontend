const API_URL = import.meta.env.VITE_API_URL;

export interface FilesData {
  type_person: string;
  files_legal_extra: string[];
  files_legal_fisica: string[];
  files_legal_moral: string[];
}

// funcion para obtener todos los archivos de un cliente
export async function getAllFilesByClientId(id: string): Promise<FilesData> {
  try {
    const response = await fetch(`${API_URL}client/legal_files/${id}`, {
      method: "GET",
    });
    const data = await response.json();

    return data.data as FilesData;
  } catch (error) {
    console.error("Error al obtener los archivos del cliente", error);
    throw error;
  }
}

// funcion para enviar un archivo
export async function uploadFileByClientId(
  id: string,
  file: File
): Promise<void> {
  try {
    const formData = new FormData();
    formData.append("files", file);
    formData.append("clientId", id);

    const response = await fetch(`${API_URL}client/upload_legal_file/${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al subir el archivo");
    }

    const data = await response.json();
    console.log("Archivo subido correctamente", data);
  } catch (error) {
    console.error("Error al subir el archivo del cliente", error);
    throw error;
  }
}

//   funcion para eliminar un archivo
export async function deleteFileByClientId(
  id: string,
  filePath: string
): Promise<void> {
  try {
    const response = await fetch(`${API_URL}client/delete/legal_files`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        id: id,
        ruta: filePath,
      }),
    });

    if (!response.ok) {
      throw new Error("Error al eliminar el archivo");
    }

    const data = await response.json();
    console.log("Archivo eliminado correctamente", data);
  } catch (error) {
    console.error("Error al eliminar el archivo del cliente", error);
    throw error;
  }
}

export const uploadPaymentFileById = async (id: string, formData: FormData) => {
  try {
    const response = await fetch(`${API_URL}change/upload_archivo_pago/${id}`, {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error uploading payment file:", error);
    throw error;
  }
};
