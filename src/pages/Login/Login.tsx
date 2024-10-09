import React, { useState } from "react";
import {
  AppProvider,
  Card,
  TextField,
  Button,
  Spinner,
} from "@shopify/polaris";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault(); // Evitar recargar la página si se pasa el evento
    }
    setIsLoading(true);
    setEmailError(undefined);
    setPasswordError(undefined);

    // Validaciones básicas
    if (!email) {
      setEmailError("El correo electrónico es requerido.");
    }
    if (!password) {
      setPasswordError("La contraseña es requerida.");
    }

    if (email?.length > 0 && password?.length > 0) {
      localStorage.setItem("email", email);
      setIsLoading(false);
      alert("Inicio de sesión exitoso");
    } else {
      setIsLoading(false);
      setEmailError("Credenciales incorrectas");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AppProvider i18n={{}}>
        <div className="flex flex-col items-center justify-center gap-3">
          <span className="font-bold text-[20px]">Iniciar sesión</span>
          <Card>
            <TextField
              label="Correo electrónico"
              value={email}
              onChange={(value) => setEmail(value)}
              type="email"
              autoComplete="email"
              error={emailError} // Mostrar el error específico del correo
            />
            <TextField
              label="Contraseña"
              value={password}
              onChange={(value) => setPassword(value)}
              type="password"
              autoComplete="current-password"
              error={passwordError} // Mostrar el error específico de la contraseña
            />
            <div className="mt-2 flex items-center gap-2">
              <Button
                onClick={handleSubmit}
                variant="primary"
                disabled={isLoading}
              >
                {isLoading ? <Spinner size="small" /> : "Iniciar sesión"}
              </Button>
            </div>
          </Card>
        </div>
      </AppProvider>
    </form>
  );
};

export default Login;
