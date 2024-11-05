import { useState } from "react";
import { Modal, TextContainer, Select, TextField } from "@shopify/polaris";
import { Toast } from "../../components/Toast/toast";
import {
  uploadFileByClientId,
  uploadPaymentFileById,
} from "../../services/files";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useAuthToken } from "../../hooks/useAuthToken";

interface ModalArchivos {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id?: string;
  isPayment?: boolean;
  setFinishLoading?: (loading: boolean) => void;
  regimen: string | undefined;
  uploadedFiles: string[];
}

export default function ModalSubirArchivos({
  isOpen,
  setIsOpen,
  id,
  isPayment,
  setFinishLoading,
  regimen,
  uploadedFiles,
}: ModalArchivos) {
  const { userInfo } = useAuthToken();
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const [fileName, setFileName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const getFileNameFromPath = (path: string) => path.split("/").pop();
  const uploadedFileNames = uploadedFiles.map(getFileNameFromPath);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];

      const fileName = selectedFile.name;
      if (uploadedFileNames.includes(fileName)) {
        Toast.fire({
          icon: "warning",
          title: `El archivo ${fileName} ya ha sido subido anteriormente.`,
        });
        return;
      }

      if (selectedFile.type !== "application/pdf") {
        Toast.fire({
          icon: "warning",
          title: "Por favor selecciona un archivo PDF",
        });
        return;
      }

      setFileToUpload(selectedFile);
    }
  };

  const handleFileUpload = async () => {
    if (
      !fileToUpload ||
      (!selectedOption &&
        selectedOption !== "otro" &&
        !pathname.includes("prospecto"))
    ) {
      Toast.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo y una opción",
      });
      return;
    }
    if (pathname.includes("prospecto") && !fileToUpload) {
      Toast.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo",
      });
      return;
    }

    try {
      setIsLoading(true);
      let renamedFile: File;

      if (
        regimen &&
        selectedOption &&
        selectedOption !== "otro" &&
        userInfo &&
        userInfo.id
      ) {
        renamedFile = new File([fileToUpload], `${selectedOption}.pdf`, {
          type: fileToUpload.type,
        });
        await uploadFileByClientId(id!, renamedFile, userInfo.id);
        setIsLoading(false);
      } else if (
        regimen &&
        (selectedOption === "otro" || isPayment) &&
        userInfo &&
        userInfo.id
      ) {
        renamedFile = new File([fileToUpload], fileName || "archivo_pago", {
          type: fileToUpload.type,
        });
        const formData = new FormData();
        formData.append("archivo_pago", renamedFile);
        await uploadPaymentFileById(id!, formData, userInfo.id);
        setIsLoading(false);
      } else if (!regimen && !isPayment && userInfo && userInfo.id) {
        renamedFile = new File([fileToUpload], "archivo_pago", {
          type: fileToUpload.type,
        });
        const formData = new FormData();
        formData.append("archivo_pago", renamedFile);
        await uploadPaymentFileById(id!, formData, userInfo?.id);
        setIsLoading(false);
      }

      Toast.fire({
        icon: "success",
        title: "Archivo subido correctamente",
      });
      if (pathname.includes("prospecto")) {
        navigate("/leads?selected=comprador");
      }
      if (!pathname.includes("prospecto")) {
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      if (setFinishLoading) {
        setFinishLoading(true);
      }
      setIsOpen(false);
    } catch (error) {
      if (setFinishLoading) {
        setFinishLoading(true);
      }
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
    }
  };

  const opcionesFisica = [
    { label: "Selecciona un opción", value: "" },
    { label: "INE", value: "ine" },
    { label: "CURP", value: "curp" },
    { label: "Acta de nacimiento", value: "acta_nacimiento" },
    { label: "Comprobante de domicilio", value: "domicilio" },
    { label: "Situación fiscal", value: "situacion_fiscal" },
    { label: "Otro", value: "otro" },
  ].map((option) => ({
    ...option,
    disabled: uploadedFileNames.includes(`${option.value}.pdf`),
    label: uploadedFileNames.includes(`${option.value}.pdf`)
      ? `${option.label} - este archivo ya se subió`
      : option.label,
  }));

  const opcionesMoral = [
    { label: "Selecciona un opción", value: "" },
    { label: "INE del representante", value: "ine_representante" },
    { label: "Domicilio del representante", value: "domicilio_representante" },
    {
      label: "Situación fiscal del representante",
      value: "situacion_fiscal_representante",
    },
    { label: "Acta constitutiva", value: "acta_constitutiva" },
    { label: "Poderes de representación", value: "poderes_representacion" },
    { label: "Domicilio de la moral", value: "domicilio_moral" },
    { label: "Situación fiscal de la moral", value: "situacion_fiscal_moral" },
    { label: "Otro", value: "otro" },
  ].map((option) => ({
    ...option,
    disabled: uploadedFileNames.includes(`${option.value}.pdf`),
    label: uploadedFileNames.includes(`${option.value}.pdf`)
      ? `${option.label} - este archivo ya se subió`
      : option.label,
  }));

  const opciones = regimen === "FISICA" ? opcionesFisica : opcionesMoral;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title={
        regimen
          ? `Sube un archivo del régimen ${regimen}`
          : "Sube el Archivo de Pago"
      }
      primaryAction={{
        disabled: isLoading,
        content: !isPayment
          ? "Subir Pago"
          : isLoading
          ? "Cargando..."
          : "Subir Archivo",
        onAction: handleFileUpload,
      }}
      secondaryActions={[
        {
          content: "Cancelar",
          onAction: () => setIsOpen(false),
        },
      ]}
    >
      <Modal.Section>
        <TextContainer>
          <div className="flex flex-col gap-4">
            <p>Selecciona el archivo PDF que deseas subir.</p>
            {regimen && (
              <Select
                label="Selecciona el tipo de archivo"
                options={opciones}
                onChange={(value) => setSelectedOption(value)}
                value={selectedOption}
              />
            )}
            {selectedOption === "otro" && (
              <TextField
                label="Nombre del archivo"
                value={fileName}
                onChange={(value) => setFileName(value)}
                placeholder="Escribe el nombre del archivo"
                autoComplete="off"
              />
            )}
            <input
              type="file"
              onChange={handleFileChange}
              accept="application/pdf"
            />
          </div>
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}
