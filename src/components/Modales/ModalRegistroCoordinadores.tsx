import { Frame, Modal, TextContainer, TextField } from "@shopify/polaris";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { Toast } from "../Toast/toast";
import { createCoordinator } from "../../services/coordinadores";
import { useAuthToken } from "../../hooks/useAuthToken";

export interface Coordinator {
  _id?: string;
  name: string;
  paternal_surname: string;
  maternal_surname: string;
  email: string;
  cellphone: string;
  city: string;
  state: string;
  oficina: string;
  role: string;
}

interface ModalRegistroCoordinadoresProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
}

interface FormValues {
  nombre: string;
  apellidop: string;
  apellidom: string;
  correo: string;
  contrasena: string;
  confirmContrasena: string;
  telefono: string;
  ciudad: string;
  estado: string;
  oficina: string;
  rol: string;
}

const initialFormValues: FormValues = {
  nombre: "",
  apellidop: "",
  apellidom: "",
  correo: "",
  contrasena: "",
  confirmContrasena: "",
  telefono: "",
  ciudad: "",
  estado: "",
  oficina: "",
  rol: "COORDINADOR",
};

export default function ModalRegistroCoordinadores({
  isOpen,
  setIsOpen,
}: ModalRegistroCoordinadoresProps) {
  const { userInfo } = useAuthToken();
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  useEffect(() => {
    const allFieldsFilled = Object.values(formValues).every(
      (value) => value.trim() !== ""
    );
    const passwordsAreEqual =
      formValues.contrasena === formValues.confirmContrasena;
    setIsSubmitDisabled(!(allFieldsFilled && passwordsAreEqual));
  }, [formValues]);

  useEffect(() => {
    if (formValues.contrasena && formValues.confirmContrasena) {
      if (formValues.contrasena !== formValues.confirmContrasena) {
        setErrors((prev) => ({
          ...prev,
          confirmContrasena: "Las contraseñas no coinciden",
        }));
      } else {
        setErrors((prev) => ({
          ...prev,
          confirmContrasena: "",
        }));
      }
    }
  }, [formValues.contrasena, formValues.confirmContrasena]);

  useEffect(() => {
    if (generalError) {
      Toast.fire({
        icon: "error",
        title: generalError,
      });
      setGeneralError(null);
    }
  }, [generalError]);

  const handleSubmit = async () => {
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof FormValues]) {
        newErrors[key] = "Campo obligatorio";
      }
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    setErrors({});

    try {
      const newCoordinator: Coordinator = {
        name: formValues.nombre,
        paternal_surname: formValues.apellidop,
        maternal_surname: formValues.apellidom,
        email: formValues.correo,
        cellphone: formValues.telefono,
        city: formValues.ciudad,
        state: formValues.estado,
        oficina: formValues.oficina,
        role: formValues.rol,
      };

      if (userInfo && userInfo.id) {
        const createdCoordinator = await createCoordinator(
          userInfo.id,
          newCoordinator
        );

        if (createdCoordinator && createdCoordinator.result) {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            formValues.correo,
            formValues.contrasena
          );
          const user = userCredential.user;

          console.log("Coordinador registrado con éxito en Firebase:", user);
          Toast.fire({ icon: "success", title: "Coordinador registrado" });
          setTimeout(() => {
            window.location.reload();
          }, 600);
          setIsOpen(false);
        } else {
          throw new Error("Error al crear el coordinador en la base de datos");
        }
      }
    } catch (error) {
      const errorMessage = typeof error === "string" ? error : String(error);
      setGeneralError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => setIsOpen(false)}
          title="Registro de Coordinadores"
          primaryAction={{
            content: isLoading ? "Cargando..." : "Registrar",
            onAction: handleSubmit,
            disabled: isSubmitDisabled || isLoading,
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
              <TextField
                label="Nombre"
                value={formValues.nombre}
                onChange={(value) => handleFieldChange("nombre", value)}
                autoComplete="off"
                error={errors.nombre}
              />
              <TextField
                label="Apellido Paterno"
                value={formValues.apellidop}
                onChange={(value) => handleFieldChange("apellidop", value)}
                autoComplete="off"
                error={errors.apellidop}
              />
              <TextField
                label="Apellido Materno"
                value={formValues.apellidom}
                onChange={(value) => handleFieldChange("apellidom", value)}
                autoComplete="off"
                error={errors.apellidom}
              />
              <TextField
                label="Ciudad"
                value={formValues.ciudad}
                onChange={(value) => handleFieldChange("ciudad", value)}
                autoComplete="off"
                error={errors.ciudad}
              />
              <TextField
                label="Estado"
                value={formValues.estado}
                onChange={(value) => handleFieldChange("estado", value)}
                autoComplete="off"
                error={errors.estado}
              />
              <TextField
                label="Oficina"
                value={formValues.oficina}
                onChange={(value) => handleFieldChange("oficina", value)}
                autoComplete="off"
                error={errors.oficina}
              />
              <TextField
                label="Teléfono"
                value={formValues.telefono}
                onChange={(value) => handleFieldChange("telefono", value)}
                autoComplete="off"
                error={errors.telefono}
              />
              <TextField
                label="Correo Electrónico"
                value={formValues.correo}
                onChange={(value) => handleFieldChange("correo", value)}
                autoComplete="off"
                error={errors.correo}
              />
              <TextField
                label="Contraseña"
                type="password"
                value={formValues.contrasena}
                onChange={(value) => handleFieldChange("contrasena", value)}
                autoComplete="off"
                error={errors.contrasena}
              />
              <TextField
                label="Confirmar Contraseña"
                type="password"
                value={formValues.confirmContrasena}
                onChange={(value) =>
                  handleFieldChange("confirmContrasena", value)
                }
                autoComplete="off"
                error={errors.confirmContrasena}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
