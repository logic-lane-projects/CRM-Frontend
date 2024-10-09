import { Button, Frame, Key, Modal, TextContainer} from "@shopify/polaris";
import { useState, useCallback } from "react";
import { TextField } from "@shopify/polaris";

// Declaración de la interfaz para las props del modal
interface ModalRegistroUsuariosProps {
  isOpen: boolean; // Prop para controlar si el modal está abierto
  setIsOpen: (value: boolean) => void;
}

export default function ModalRegistroUsuarios({
  isOpen,
  setIsOpen,
}: ModalRegistroUsuariosProps) {
  const [nombre, setNombre] = useState("");
  const [apellidop, setAppellidop] = useState("");
  const [apellidom, setApellidom] = useState("");
  const [correo, setCorreo] = useState("");
  const [contrasena, setContrasena] = useState("");
  const [telefono, setTelefono] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [rol, setRol] = useState("");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleSubmit = () => {

    const newErrors: {[key: string]: string} = {};//Mensaje de error para cada campo vacío

    // Validación de campos
    if(!nombre) newErrors.nombre = 'Campo obligatorio';
    if(!apellidop) newErrors.apellidop = 'Campo obligatorio';
    if(!apellidom) newErrors.apellidom = 'Campo obligatorio';
    if(!correo) newErrors.correo = 'Campo obligatorio';
    if(!contrasena) newErrors.contrasena = 'Campo obligatorio';
    if(!telefono) newErrors.telefono = 'Campo obligatorio';
    if(!ciudad) newErrors.ciudad = 'Campo obligatorio';
    if(!rol) newErrors.rol = 'Campo obligatorio';

    if (Object.keys(newErrors).length>0) {
      setErrors(newErrors); // Mensaje de error si algún campo está vacío
      return;
    }
    setErrors({});
    console.log("Registrar:", { nombre, apellidop, apellidom, correo, contrasena, telefono, ciudad, rol });    
    setIsOpen(false); // Cierra el modal
  };

  return (
    <div>
      <Frame>
        <Modal
          open={isOpen}
          onClose={() => {
            setIsOpen(!isOpen);
          }}
          title="Registro de usuarios"
          primaryAction={{
            content: "Registrar",
            onAction: handleSubmit,
          }}
          secondaryActions={[
            {
              content: "Cancelar",
              onAction: () => {
                setIsOpen(false);
              },
            },
          ]}
        >
          <Modal.Section>
            <TextContainer>
              <div>             
                <div>
                  <TextField
                    label="Nombre"
                    value={nombre}
                    onChange={(value) => {
                      setNombre(value);
                      setErrors((prev) => ({ ...prev,nombre: ''}));
                    }}
                    autoComplete="off"
                    error={errors.nombre}
                  />
                </div>
                <div>
                  <TextField
                    label="Apellido Paterno"
                    value={apellidop}
                    onChange={(value) => {
                      setAppellidop(value);
                      setErrors((prev) => ({ ...prev,apellidop: ''}));//Limpieza de errores al cambiar
                    }}
                    autoComplete="off"
                    error={errors.apellidop}
                  />
                </div>
                <div>
                  <TextField
                    label="Apellido materno"
                    value={apellidom}
                    onChange={(value) => {
                      setApellidom(value);
                      setErrors((prev) => ({ ...prev,apellidom: ''}));
                    }}
                    autoComplete="off"
                    error={errors.apellidom}
                  />
                </div>
                <div>
                  <TextField
                    label="Correo electrónico"
                    value={correo}
                    onChange={(value) => {
                      setCorreo(value);
                      setErrors((prev) => ({ ...prev,correo: ''}));
                    }}
                    autoComplete="off"
                    error={errors.correo}
                  />
                </div>
                <div>
                  <TextField
                    label="Contraseña"
                    type="password"
                    value={contrasena}
                    onChange={(value) => {
                      setContrasena(value);
                      setErrors((prev) => ({ ...prev,contrasena: ''}));
                    }}
                    autoComplete="off"
                    error={errors.contrasena}
                  />
                </div>
                <div>
                  <TextField
                    label="Teléfono"
                    value={telefono}
                    onChange={(value) => {
                      setTelefono(value);
                      setErrors((prev) => ({ ...prev,telefono: ''}));
                    }}
                    autoComplete="off"
                    error={errors.telefono}
                  />
                </div>
                <div>
                  <TextField
                    label="Ciudad"
                    value={ciudad}
                    onChange={(value) => {
                      setCiudad(value);
                      setErrors((prev) => ({ ...prev,ciudad: ''}));
                    }}
                    autoComplete="off"
                    error={errors.ciudad}
                  />
                </div>
                <div>
                  <TextField
                    label="Rol"
                    value={rol}
                    onChange={(value) => {
                      setRol(value);
                      setErrors((prev) => ({ ...prev,rol: ''}));
                    }}
                    autoComplete="off"
                    error={errors.rol}
                  />
                </div>
              </div>
            </TextContainer>
          </Modal.Section>          
        </Modal>
      </Frame>
    </div>
  );
}
