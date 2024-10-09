import {
  Button,
  Frame,
  Modal,
  TextContainer,
  TextField,
} from "@shopify/polaris";
import { useState, useEffect } from "react";

// Declaración de la interfaz para las props del modal
interface ModalRegistroUsuariosProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

// Tipo para los valores del formulario
interface FormValues {
  nombre: string;
  apellidop: string;
  apellidom: string;
  correo: string;
  contrasena: string;
  confirmContrasena: string;
  telefono: string;
  ciudad: string;
  rol: string;
}

// Inicialización de los valores del formulario
const initialFormValues: FormValues = {
  nombre: "",
  apellidop: "",
  apellidom: "",
  correo: "",
  contrasena: "",
  confirmContrasena: "",
  telefono: "",
  ciudad: "",
  rol: "",
};

export default function ModalRegistroUsuarios({
  isOpen,
  setIsOpen,
}: ModalRegistroUsuariosProps) {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Manejador genérico de cambios en los campos del formulario
  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Verifica si las contraseñas coinciden al cambiar cualquier campo de contraseña
    if (field === "contrasena" || field === "confirmContrasena") {
      setPasswordsMatch(
        formValues.contrasena === value || formValues.confirmContrasena === value
      );
    }
  };

  // Valida si todos los campos están completos y si las contraseñas coinciden para habilitar el botón
  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(
      (value) => value.trim() !== ""
    );
    const passwordsAreEqual =
      formValues.contrasena === formValues.confirmContrasena;
    setIsSubmitDisabled(!(allFieldsFilled && passwordsAreEqual));
  }, [formValues]);

  const handleSubmit = () => {
    const newErrors: { [key: string]: string } = {};

    // Validación de campos
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof FormValues]) {
        newErrors[key] = "Campo obligatorio";
      }
    });

    if (formValues.contrasena !== formValues.confirmContrasena) {
      newErrors.confirmContrasena = "Las contraseñas no coinciden";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    console.log("Registrar:", formValues);
    setIsOpen(false);
  };

  return (
    <div>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registro de usuarios"
          primaryAction={{
            content: "Registrar",
            onAction: handleSubmit,
            disabled: isSubmitDisabled, // Deshabilita el botón si falta algún campo o las contraseñas no coinciden
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
              {Object.keys(formValues).map((field) => (
                <TextField
                  key={field}
                  label={
                    field === "apellidom"
                      ? "Apellido Materno"
                      : field === "apellidop"
                      ? "Apellido Paterno"
                      : field === "confirmContrasena"
                      ? "Confirmar Contraseña"
                      : field.charAt(0).toUpperCase() + field.slice(1)
                  }
                  value={formValues[field as keyof FormValues]}
                  onChange={(value) =>
                    handleFieldChange(field as keyof FormValues, value)
                  }
                  autoComplete="off"
                  type={
                    field === "contrasena" || field === "confirmContrasena"
                      ? "password"
                      : "text"
                  }
                  error={
                    field === "confirmContrasena" && !passwordsMatch
                      ? "Las contraseñas no coinciden"
                      : errors[field]
                  }
                />
              ))}
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
