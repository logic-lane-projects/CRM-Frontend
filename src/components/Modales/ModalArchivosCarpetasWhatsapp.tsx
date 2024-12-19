import React, { useEffect, useState } from "react";
import { Frame, Modal, Spinner, Text } from "@shopify/polaris";
import {
  getFolderInfo,
  // uploadFileToFolder,
  // deleteFileByPath,
} from "../../services/newFiles";
import { Toast } from "../Toast/toast";
import type { FolderInfo } from "../../services/newFiles";
import { PDFFileIcon } from "../icons";

interface ModalArchivosCarpetasProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  folder: { id: string; name: string };
  fileSelected: string[];
  setFileSelected: (value: string[]) => void;
}

const ModalArchivosCarpetas: React.FC<ModalArchivosCarpetasProps> = ({
  isOpen,
  setIsOpen,
  folder,
  fileSelected,
  setFileSelected,
}) => {
  const API_URL = "https://fiftydoctorsback.com/crm";
  const [folderInfo, setFolderInfo] = useState<FolderInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  // const [uploading, setUploading] = useState<boolean>(false);
  // const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // const [deleting, setDeleting] = useState<string | null>(null);

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

  // const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = event.target.files ? event.target.files[0] : null;
  //   setSelectedFile(file);
  // };

  // const handleUpload = async () => {
  //   if (!selectedFile) {
  //     Toast.fire({
  //       icon: "warning",
  //       title: "Selecciona un archivo antes de subirlo",
  //     });
  //     return;
  //   }
  
  //   // Limpiar el nombre del archivo
  //   const cleanFileName = selectedFile.name
  //     .replace(/[^a-zA-Z0-9\s.]/g, "") // Permite solo letras, números, espacios y el punto (.)
  //     .replace(/\s+/g, " ") // Reemplaza múltiples espacios por uno solo
  //     .trim(); // Elimina espacios al inicio y final
  
  //   // Crear un nuevo archivo con el nombre limpio
  //   const cleanFile = new File([selectedFile], cleanFileName, {
  //     type: selectedFile.type,
  //   });
  
  //   setUploading(true);
  //   try {
  //     await uploadFileToFolder(folder.id, cleanFile);
  //     Toast.fire({ icon: "success", title: "Archivo subido exitosamente" });
  //     setSelectedFile(null);
  //     fetchFolderInfo();
  //   } catch (error) {
  //     console.error("Error al subir el archivo", error);
  //     Toast.fire({ icon: "error", title: "Error al subir el archivo" });
  //   } finally {
  //     setUploading(false);
  //   }
  // };
  

  // const handleDeleteFile = async (filePath: string) => {
  //   setDeleting(filePath);
  //   try {
  //     await deleteFileByPath(filePath);
  //     Toast.fire({ icon: "success", title: "Archivo eliminado exitosamente" });
  //     fetchFolderInfo();
  //   } catch (error) {
  //     console.error("Error al eliminar el archivo", error);
  //     Toast.fire({ icon: "error", title: "Error al eliminar el archivo" });
  //   } finally {
  //     setDeleting(null);
  //   }
  // };

  return (
    <div className="h-96">
      <Frame>
        <Modal
          open={isOpen}
          onClose={handleClose}
          title={`Carpeta ${folder.name}`}
          primaryAction={{
            content: "Cerrar",
            onAction: handleClose,
          }}
        >
          <Modal.Section>
            <div className="w-full flex flex-col gap-4">
              {/* <div className="">
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

              <div className="w-full flex justify-center items-center">
                <div className="w-full h-0.5 rounded-full bg-[#E9E9E9]" />
                <span className="bg-white p-1 text-[#7d7d7d] text-sm">O</span>
                <div className="w-full h-0.5 rounded-full bg-[#E9E9E9]" />
              </div> */}

              <div className="w-full flex flex-col gap-2">
                <Text variant="headingMd" as="span">Elegir de la Galería</Text>
                {loading ? (
                  <div className="flex justify-center">
                    <Spinner
                      accessibilityLabel="Cargando archivos"
                      size="large"
                    />
                  </div>
                ) : folderInfo && folderInfo?.ruta_archivos?.length > 0 ? (
                  <div className="grid grid-cols-3 gap-4 bg-[#f5f5f5] border border-[#E9E9E9] p-2 rounded-2xl">
                    {folderInfo.ruta_archivos.map((fileUrl, index) => {
                      const isSelected = fileSelected.some((item: string) => item.replace(API_URL, "") === fileUrl);
                      return(
                      <div
                        key={`files-modal-${index}`}
                        className={`relative rounded-xl text-center aspect-square w-full overflow-hidden group cursor-pointer`}
                        onClick={() => {
                          if(isSelected){
                            setFileSelected(fileSelected.filter((item) => item != `${API_URL}${fileUrl}`))
                          }else{
                            setFileSelected([...fileSelected, `${API_URL}${fileUrl}`])
                          }
                          setIsOpen(false);
                        }}
                      >
                        <div className="w-full h-full transition-all flex flex-col justify-center items-center gap-1 duration-700 bg-black bg-opacity-35 backdrop-blur-sm opacity-0 group-hover:opacity-100 absolute">
                          {isSelected 
                            ? (<p className="text-white">Quitar</p>)
                            : (<p className="text-white">Agregar</p>)}
                          {fileUrl.endsWith(".pdf") && (
                            <a
                              href={`${API_URL}${fileUrl}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block text-blue-300 hover:underline text-sm"
                              onClick={(e) => e.stopPropagation()}
                            >
                              Ver PDF
                            </a>
                          )}
                        </div>
                        {fileUrl.endsWith(".pdf") ? (
                          <div className="flex flex-col justify-center items-center w-full h-full">
                            <p className="text-sm mb-2">Archivo PDF</p>
                            <PDFFileIcon className="w-20 h-auto" />
                          </div>
                        ) : (
                          <img
                            src={`${API_URL}${fileUrl}`}
                            alt={`Archivo ${index + 1}`}
                            className="w-full h-full object-cover rounded-md"
                          />
                        )}
                        {/* <div className="flex justify-between items-center mt-2">
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
                        </div> */}
                      </div>
                      )}
                    )}
                  </div>
                ) : (
                  <p className="text-center text-gray-500">
                    No hay archivos disponibles en esta carpeta
                  </p>
                )}
              </div>
            </div>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
};

export default ModalArchivosCarpetas;
