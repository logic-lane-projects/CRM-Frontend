import { useState } from "react";
import { Modal, TextContainer, Select } from "@shopify/polaris";
import { Toast } from "../../components/Toast/toast";
import {
  uploadFileByClientId,
  uploadPaymentFileById,
} from "../../services/files";
import { useNavigate } from "react-router-dom";

interface ModalArchivos {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  id?: string;
  isPayment?: boolean;
  setFinishLoading?: (loading: boolean) => void;
  regimen: string | undefined;
}

export default function ModalSubirArchivos({
  isOpen,
  setIsOpen,
  id,
  isPayment,
  setFinishLoading,
  regimen,
}: ModalArchivos) {
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);
  const [selectedOption, setSelectedOption] = useState<string>("");
  const navigate = useNavigate();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      const selectedFile = event.target.files[0];
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
    if (!fileToUpload) {
      Toast.fire({
        icon: "warning",
        title: "Por favor selecciona un archivo",
      });
      return;
    }

    try {
      if (isPayment) {
        const renamedFile = new File([fileToUpload], fileToUpload.name, {
          type: fileToUpload.type,
        });
        await uploadFileByClientId(id!, renamedFile);
      } else {
        const formData = new FormData();
        formData.append("archivo_pago", fileToUpload, "archivo_pago");
        await uploadPaymentFileById(id!, formData);
        navigate("/leads");
      }

      Toast.fire({
        icon: "success",
        title: "Archivo subido correctamente",
      });
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

  // Opciones para regimen FISICA
  const opcionesFisica = [
    { label: "INE", value: "ine" },
    { label: "CURP", value: "curp" },
    { label: "Acta de nacimiento", value: "acta_nacimiento" },
    { label: "Comprobante de domicilio", value: "domicilio" },
    { label: "Situación fiscal", value: "situacion_fiscal" },
  ];

  // Opciones para regimen MORAL
  const opcionesMoral = [
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
  ];

  // Opciones basadas en el régimen
  const opciones = regimen === "FISICA" ? opcionesFisica : opcionesMoral;

  return (
    <Modal
      open={isOpen}
      onClose={() => setIsOpen(false)}
      title={`Sube un archivo del régimen ${regimen}`}
      primaryAction={{
        content: isPayment ? "Subir Pago" : "Subir Archivo",
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
          <p>Selecciona el archivo PDF que deseas subir.</p>
          <Select
            label="Selecciona el tipo de archivo"
            options={opciones}
            onChange={(value) => setSelectedOption(value)}
            value={selectedOption}
          />
          <input
            type="file"
            onChange={handleFileChange}
            accept="application/pdf"
          />
        </TextContainer>
      </Modal.Section>
    </Modal>
  );
}
