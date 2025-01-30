export const validarCorreo = (correo: string) => {
  const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regexCorreo.test(correo);
};

export const validarTelefono = (telefono: string) => {
  const regexTelefono = /^\d{10}$/;
  return regexTelefono.test(telefono);
};
