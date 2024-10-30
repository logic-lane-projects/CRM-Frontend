import { useState, useEffect } from "react";
import { Button } from "@shopify/polaris";
import {
  getAllFilesByClientId,
  deleteFileByClientId,
} from "../../services/files";
import { Toast } from "../../components/Toast/toast";
import type { FilesData } from "../../services/files";
import ModalSubirArchivos from "../../components/Modales/ModalSubirArchivos";
import { useLocation } from "react-router-dom";
import { useAuthToken } from "../../hooks/useAuthToken";

const API_URL = import.meta.env.VITE_API_URL;

interface ArchivosProps {
  id?: string;
  isPayment?: boolean;
  setFinishLoading?: (loading: boolean) => void;
  regimen: string;
}

export default function Archivos({
  id,
  isPayment,
  setFinishLoading,
  regimen,
}: ArchivosProps) {
  const { userInfo } = useAuthToken();
  const location = useLocation();
  const pathname = location.pathname;
  const [files, setFiles] = useState<FilesData>({
    type_person: "",
    files_legal_extra: [],
    files_legal_fisica: [],
    files_legal_moral: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [deletingFile, setDeletingFile] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const fetchFiles = async () => {
      if (id) {
        try {
          const response = await getAllFilesByClientId(id);
          setFiles({
            ...response,
            files_legal_extra: response.files_legal_extra || [],
            files_legal_fisica: response.files_legal_fisica || [],
            files_legal_moral: response.files_legal_moral || [],
          });
        } catch (error) {
          const errorMessage =
            error instanceof Error ? error.message : String(error);
          Toast.fire({
            icon: "error",
            title: errorMessage,
          });
          setError(errorMessage);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchFiles();
  }, [id]);

  const handleDeleteFile = async (filePath: string) => {
    if (!id) return;
    try {
      setDeletingFile(filePath);
      if (userInfo && userInfo.id) {
        await deleteFileByClientId(id, filePath, userInfo.id);
        setDeletingFile(null);
      } else {
        setDeletingFile(null);
        console.log("no existe id del usuario");
      }
      Toast.fire({
        icon: "success",
        title: "Archivo eliminado correctamente",
      });
      setTimeout(() => {
        window.location.reload();
      }, 300);
    } catch (error) {
      setDeletingFile(null);
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  if (loading) {
    return <div>Cargando archivos...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const filesToDisplay = [
    ...files.files_legal_extra,
    ...(files.type_person === "MORAL"
      ? files.files_legal_moral
      : files.files_legal_fisica),
  ];

  const getFileLabel = (fileName: string) => {
    const normalizedFileName = fileName.toLowerCase();

    // Archivos para persona fisica
    if (
      normalizedFileName.includes("ine") &&
      !normalizedFileName.includes("representante")
    ) {
      return "INE";
    } else if (normalizedFileName.includes("curp")) {
      return "CURP";
    } else if (normalizedFileName.includes("archivo_pago")) {
      return "Archivo de pago";
    } else if (normalizedFileName.includes("acta_nacimiento")) {
      return "Acta de nacimiento";
    } else if (
      normalizedFileName.includes("domicilio") &&
      !normalizedFileName.includes("moral") &&
      !normalizedFileName.includes("representante")
    ) {
      return "Comprobante de domicilio";
    } else if (
      normalizedFileName.includes("situacion_fiscal") &&
      !normalizedFileName.includes("moral") &&
      !normalizedFileName.includes("representante")
    ) {
      return "Situación fiscal";

      // Archivos para persona moral
    } else if (normalizedFileName.includes("ine_representante")) {
      return "INE del representante";
    } else if (normalizedFileName.includes("domicilio_representante")) {
      return "Domicilio del representante";
    } else if (normalizedFileName.includes("situacion_fiscal_representante")) {
      return "Situación fiscal del representante";
    } else if (normalizedFileName.includes("acta_constitutiva")) {
      return "Acta constitutiva";
    } else if (normalizedFileName.includes("poderes_representacion")) {
      return "Poderes de representación";
    } else if (normalizedFileName.includes("domicilio_moral")) {
      return "Domicilio de la moral";
    } else if (normalizedFileName.includes("situacion_fiscal_moral")) {
      return "Situación fiscal de la moral";
    }

    return fileName.split("/").pop() || "Archivo desconocido";
  };

  return (
    <div>
      <div className="flex w-full items-center justify-between">
        <span className="font-semibold text-[15px]">{`Archivos`}</span>
        <Button
          onClick={() => {
            if (pathname.includes("prospecto")) {
              setIsOpen(true);
            }
            if (
              pathname.includes("comprador") ||
              pathname.includes("cliente")
            ) {
              if (!regimen) {
                Toast.fire({
                  icon: "error",
                  title: "Primero debes de elegir el regimen del usuario",
                });
                return;
              } else {
                setIsOpen(true);
              }
            }
          }}
        >
          Subir Archivo
        </Button>
      </div>

      <div className="grid grid-cols-3 items-center gap-7">
        {filesToDisplay.length > 0 ? (
          filesToDisplay.map((file, index) => (
            <div
              className="flex flex-col min-w-[200px] max-w-[250px] min-h-[200px] max-h-[200px] items-center justify-around"
              key={index}
            >
              <span className="text-semibold">{getFileLabel(file)}</span>
              <img src="/images/pdfIcon.png" alt="" />
              <div>
                <a
                  href={`${
                    API_URL.endsWith("/")
                      ? API_URL + file.slice(1)
                      : API_URL + file
                  }`}
                  download={file.split("/").pop()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="border px-2 py-[4px] rounded-md bg-green-500 text-white"
                >
                  Descargar
                </a>
                <Button
                  disabled={deletingFile === file}
                  onClick={() => {
                    handleDeleteFile(file);
                  }}
                >
                  {deletingFile === file ? "Cargando..." : "Eliminar"}
                </Button>
              </div>
            </div>
          ))
        ) : (
          <li>No hay archivos disponibles.</li>
        )}
      </div>

      {isOpen && (
        <ModalSubirArchivos
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          setFinishLoading={setFinishLoading}
          id={id}
          isPayment={isPayment}
          regimen={regimen}
          uploadedFiles={filesToDisplay}
        />
      )}
    </div>
  );
}
