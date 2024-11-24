import React, { useEffect, useState } from "react";
import { Frame, Modal, Spinner } from "@shopify/polaris";
import {
  getFolderInfo,
  uploadFileToFolder,
  deleteFileByPath,
} from "../../services/newFiles";
import { Toast } from "../Toast/toast";
import type { FolderInfo } from "../../services/newFiles";

interface ModalArchivosCarpetasProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  folder: { id: string; name: string };
}

const ModalArchivosCarpetas: React.FC<ModalArchivosCarpetasProps> = ({
  isOpen,
  setIsOpen,
  folder,
}) => {
  const API_URL = import.meta.env.VITE_API_URL;
  const [folderInfo, setFolderInfo] = useState<FolderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [uploading, setUploading] = useState<boolean>(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [deleting, setDeleting] = useState<string | null>(null);

  const handleClose = () => {
    setIsOpen(false);
  };

  const fetchFolderInfo = async () => {
    setLoading(true);
    try {
      const folderData = await getFolderInfo(folder.id);
      setFolderInfo(folderData);
    } catch (error) {
      console.error("Error al obtener la información de la carpeta", error);
      Toast.fire({ icon: "error", title: "Error al obtener la información de la carpeta" });
    } finally {
      setLoading(false);
    }
  };
  

  useEffect(() => {
    if (isOpen) {
      fetchFolderInfo();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, folder.id]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      Toast.fire({
        icon: "warning",
        title: "Selecciona un archivo antes de subirlo",
      });
      return;
    }
  
    // Limpiar el nombre del archivo
    const cleanFileName = selectedFile.name
      .replace(/[^a-zA-Z0-9\s.]/g, "") // Permite solo letras, números, espacios y el punto (.)
      .replace(/\s+/g, " ") // Reemplaza múltiples espacios por uno solo
      .trim(); // Elimina espacios al inicio y final
  
    // Crear un nuevo archivo con el nombre limpio
    const cleanFile = new File([selectedFile], cleanFileName, {
      type: selectedFile.type,
    });
  
    setUploading(true);
    try {
      await uploadFileToFolder(folder.id, cleanFile);
      Toast.fire({ icon: "success", title: "Archivo subido exitosamente" });
      setSelectedFile(null);
      fetchFolderInfo();
    } catch (error) {
      console.error("Error al subir el archivo", error);
      Toast.fire({ icon: "error", title: "Error al subir el archivo" });
    } finally {
      setUploading(false);
    }
  };
  

  const handleDeleteFile = async (filePath: string) => {
    setDeleting(filePath);
    try {
      await deleteFileByPath(filePath);
      Toast.fire({ icon: "success", title: "Archivo eliminado exitosamente" });
      fetchFolderInfo();
    } catch (error) {
      console.error("Error al eliminar el archivo", error);
      Toast.fire({ icon: "error", title: "Error al eliminar el archivo" });
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="h-96">
      <Frame>
        <Modal
          open={isOpen}
          onClose={handleClose}
          title={`Carpeta: ${folder.name}`}
          primaryAction={{
            content: "Cerrar",
            onAction: handleClose,
          }}
        >
          <div className="p-4">
            <div className="mb-4">
              <p className="text-sm text-gray-600">
                <strong>ID de la carpeta:</strong> {folderInfo?._id}
              </p>
              <p className="text-sm text-gray-600">
                <strong>Nombre de la carpeta:</strong>{" "}
                {folderInfo?.nombre_carpeta}
              </p>
            </div>

            <div className="mb-4">
              <label
                htmlFor="file-upload"
                className="block text-sm font-medium text-gray-700"
              >
                Selecciona un archivo para subir (imágenes o PDF):
              </label>
              <input
                id="file-upload"
                type="file"
                accept="image/*,application/pdf"
                onChange={handleFileChange}
                className="mt-2 p-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={handleUpload}
                disabled={uploading}
                className={`mt-2 px-4 py-2 rounded-md text-white ${
                  uploading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {uploading ? "Subiendo..." : "Subir archivo"}
              </button>
            </div>

            <div className="mt-4">
              {loading ? (
                <div className="flex justify-center">
                  <Spinner
                    accessibilityLabel="Cargando archivos"
                    size="large"
                  />
                </div>
              ) : folderInfo && folderInfo?.ruta_archivos?.length > 0 ? (
                <div className="grid grid-cols-3 gap-4">
                  {folderInfo.ruta_archivos.map((fileUrl, index) => (
                    <div
                      key={index}
                      className="relative bg-gray-100 border border-gray-300 rounded-lg p-2 text-center"
                    >
                      {fileUrl.endsWith(".pdf") ? (
                        <div className="flex flex-col items-center">
                          <p className="text-sm mb-2">Archivo PDF</p>
                          <a
                            href={`${API_URL}${fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-block text-blue-600 hover:underline text-sm"
                          >
                            Ver PDF
                          </a>
                        </div>
                      ) : (
                        <img
                          src={`${API_URL}${fileUrl}`}
                          alt={`Archivo ${index + 1}`}
                          className="w-full h-32 object-cover rounded-md mb-2"
                        />
                      )}
                      <div className="flex justify-between items-center mt-2">
                        <a
                          href={`${API_URL}${fileUrl}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-block text-blue-600 hover:underline text-sm"
                        >
                          Descargar
                        </a>
                        <button
                          onClick={() => handleDeleteFile(fileUrl)}
                          disabled={deleting === fileUrl}
                          className={`text-sm px-2 py-1 rounded-md text-white ${
                            deleting === fileUrl
                              ? "bg-gray-400 cursor-not-allowed"
                              : "bg-red-600 hover:bg-red-700"
                          }`}
                        >
                          {deleting === fileUrl ? "Eliminando..." : "Eliminar"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-gray-500">
                  No hay archivos disponibles en esta carpeta
                </p>
              )}
            </div>
          </div>
        </Modal>
      </Frame>
    </div>
  );
};

export default ModalArchivosCarpetas;
