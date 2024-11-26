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
import { createUser } from "../../services/user";
import { useNavigate } from "react-router-dom";
import { Ciudades } from "../../utils/estados";
import { useAuthToken } from "../../hooks/useAuthToken";

interface ModalRegistroUsuariosProps {
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
  rol: UserRole;
  oficinas_permitidas: string[];
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
  oficinas_permitidas: [],
  rol: UserRole.Vendedor,
};

export default function ModalRegistroUsuarios({
  isOpen,
  setIsOpen,
}: ModalRegistroUsuariosProps) {
  const navigate = useNavigate();
  const { permisos } = useAuthToken();
  const crearAdministradores = permisos?.includes("Crear Administradores");
  const [formValues, setFormValues] = useState<FormValues>(initialFormValues);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [passwordsMatch, setPasswordsMatch] = useState(true);
  const [estados, setEstados] = useState<string[]>([]);
  const [ciudades, setCiudades] = useState<string[]>([]);

  const roleOptions = [
    { label: "Vendedor", value: UserRole.Vendedor, permiso: true },
    { label: "Administrador", value: UserRole.Administrador, permiso: crearAdministradores },
    { label: "Asignador", value: UserRole.Asignador, permiso: true },
    { label: "Coordinador", value: UserRole.Coordinador, permiso: true },
    { label: "Marketing", value: UserRole.Marketing, permiso: true },
  ].filter((role) => role.permiso);
  

  useEffect(() => {
    setEstados(Ciudades.map((item) => item.Estado));
  }, []);

  const handleFieldChange = (field: keyof FormValues, value: string) => {
    setFormValues((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
    if (field === "contrasena" || field === "confirmContrasena") {
      setPasswordsMatch(
        formValues.contrasena === value ||
          formValues.confirmContrasena === value
      );
    }
    if (field === "estado") {
      const selectedEstado = Ciudades.find((item) => item.Estado === value);
      setCiudades(selectedEstado ? selectedEstado.Ciudad : []);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const newErrors: { [key: string]: string } = {};

    // Verificación de campos vacíos
    Object.keys(formValues).forEach((key) => {
      if (!formValues[key as keyof FormValues]) {
        newErrors[key] = "Campo obligatorio";
      }
    });

    // Verificación de contraseñas coincidentes
    if (formValues.contrasena !== formValues.confirmContrasena) {
      newErrors.confirmContrasena = "Las contraseñas no coinciden";
    }

    // Verificación de longitud mínima de la contraseña
    if (formValues.contrasena && formValues.contrasena.length < 6) {
      newErrors.contrasena = "La contraseña debe tener al menos 6 caracteres";
    }

    // Si hay errores, no continuar
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoading(false);
      return;
    }
    setErrors({});

    try {
      const response = await createUser({
        name: formValues.nombre,
        paternal_surname: formValues.apellidop,
        maternal_surname: formValues.apellidom,
        email: formValues.correo,
        cellphone: formValues.telefono,
        city: formValues.ciudad,
        role: formValues.rol,
        oficinas_permitidas: [],
        permisos: [],
        state: formValues.estado,
      });
      if (!response.success) {
        throw new Error(
          response.message || "Error desconocido al crear el usuario"
        );
      }

      let userId: string | undefined;

      if (response?.data && response.data.data) {
        userId = response.data.data._id;
      }

      const userCredential = await createUserWithEmailAndPassword(
        auth,
        formValues.correo,
        formValues.contrasena
      );
      const user = userCredential.user;

      Toast.fire({
        icon: "success",
        title: `Usuario ${user.email} registrado`,
        timer: 5000,
      });

      setIsOpen(false);
      setTimeout(() => {
        navigate(`/usuario/${userId}`);
      }, 500);
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      Toast.fire({
        icon: "error",
        title: errorMessage,
        timer: 5000,
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
          title="Registro de usuarios"
          primaryAction={{
            content: isLoading ? "Cargando..." : "Registrar",
            onAction: handleSubmit,
            disabled: isLoading,
          }}
          secondaryActions={[
            { content: "Cancelar", onAction: () => setIsOpen(false) },
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
              <Select
                label="Estado"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...estados.map((estado) => ({
                    label: estado,
                    value: estado,
                  })),
                ]}
                onChange={(value) => handleFieldChange("estado", value)}
                value={formValues.estado}
                error={errors.estado}
              />
              <Select
                label="Ciudad"
                options={[
                  { label: "Selecciona una opción", value: "" },
                  ...ciudades.map((ciudad) => ({
                    label: ciudad,
                    value: ciudad,
                  })),
                ]}
                onChange={(value) => handleFieldChange("ciudad", value)}
                value={formValues.ciudad}
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
