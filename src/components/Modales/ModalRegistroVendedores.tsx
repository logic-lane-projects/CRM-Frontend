import {
  Frame,
  Modal,
  TextContainer,
  TextField,
  Select,
} from "@shopify/polaris";
import { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../../firebase";
import { Toast } from "../Toast/toast";
import { UserRole } from "../../types/enums";
import { createUser } from '../../services/users';

// Declaración de la interfaz para las props del modal
interface ModalRegistroVendedoresProps {
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
  rol: UserRole;
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
  rol: UserRole.Vendedor,
};

export default function ModalRegistroVendedores({
  isOpen,
  setIsOpen,
}: ModalRegistroVendedoresProps) {
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitDisabled, setIsSubmitDisabled] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);

  // Opciones para el select de roles, usando el enum
  const roleOptions = [
    { label: "Vendedor", value: UserRole.Vendedor },
    { label: "Administrador", value: UserRole.Administrador },
  ];

  // Manejador genérico de cambios en los campos del formulario
  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));

    // Verifica si las contraseñas coinciden al cambiar cualquier campo de contraseña
    if (field === "contrasena" || field === "confirmContrasena") {
      setPasswordsMatch(
        formValues.contrasena === value ||
          formValues.confirmContrasena === value
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

  const handleSubmit = async () => {
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};
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
      setIsLoading(false);
      return;
    }
    setErrors({});
  
    try {
      // 1. Crear el usuario en la base de datos primero
      const newUser = await createUser({
        id:"",
        name: formValues.nombre,
        paternal_surname: formValues.apellidop,
        maternal_surname: formValues.apellidom,
        email: formValues.correo,
        cellphone: formValues.telefono,
        city: formValues.ciudad,
        role: formValues.rol,
      });
      
      console.log("Usuario creado en la base de datos:", newUser);
  
      // 2. Crear el usuario en Firebase después de que haya sido creado en la base de datos
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.correo,
        formValues.contrasena
      );
      const user = userCredential.user;
  
      console.log("Usuario registrado con éxito en Firebase:", user);
      Toast.fire({ icon: "success", title: "Usuario registrado" });
      setIsOpen(false); // Cerrar el modal tras el registro exitoso
    } catch (error) {
      console.error("Error al registrar el usuario:", error);
      setErrors((prev) => ({
        ...prev,
        correo: "Hubo un problema al registrar el usuario",
      }));
  
      const errorMessage = typeof error === "string" ? error : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
      });
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
          title="Registro de vendedores"
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
                label="Correo electrónico"
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
                error={
                  !passwordsMatch
                    ? "Las contraseñas no coinciden"
                    : errors.confirmContrasena
                }
              />
              <TextField
                label="Teléfono"
                value={formValues.telefono}
                onChange={(value) => handleFieldChange("telefono", value)}
                autoComplete="off"
                error={errors.telefono}
              />
              <TextField
                label="Ciudad"
                value={formValues.ciudad}
                onChange={(value) => handleFieldChange("ciudad", value)}
                autoComplete="off"
                error={errors.ciudad}
              />
              <Select
                label="Rol"
                options={roleOptions}
                onChange={(value) =>
                  handleFieldChange("rol", value as UserRole)
                }
                value={formValues.rol}
                error={errors.rol}
              />
            </TextContainer>
          </Modal.Section>
        </Modal>
      </Frame>
    </div>
  );
}
