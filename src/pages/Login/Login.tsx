import React, { useState, useEffect } from "react";
import {
  AppProvider,
  Card,
  TextField,
  Button,
  Spinner,
} from "@shopify/polaris";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./../../../firebase";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const accessToken = localStorage.getItem("accessTokenCRM");
    const storedEmail = localStorage.getItem("email");

    if (accessToken && storedEmail) {
      navigate("/inicio");
    }
  }, [navigate]);

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) {
      event.preventDefault();
    }
    setIsLoading(true);
    setEmailError(undefined);
    setPasswordError(undefined);

    if (!email) {
      setEmailError("El correo electrónico es requerido.");
      setIsLoading(false);
      return;
    }
    if (!password) {
      setPasswordError("La contraseña es requerida.");
      setIsLoading(false);
      return;
    }

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      const token = await user.getIdToken();

      localStorage.setItem("accessTokenCRM", token);
      if (user.email) {
        localStorage.setItem("email", user.email);
      } else {
        console.warn("El usuario no tiene un email");
      }

      setIsLoading(false);
      navigate("/inicio");
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setEmailError("Credenciales incorrectas o el usuario no existe.");
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <AppProvider i18n={{}}>
        <div className="w-screen h-screen flex flex-col items-center justify-center gap-3">
          <span className="font-bold text-[20px]">Iniciar sesión</span>
          <Card>
            <TextField
              label="Correo electrónico"
              value={email}
              onChange={(value) => setEmail(value)}
              type="email"
              autoComplete="email"
              error={emailError}
            />
            <TextField
              label="Contraseña"
              value={password}
              onChange={(value) => setPassword(value)}
              type="password"
              autoComplete="current-password"
              error={passwordError}
            />
            <div className="mt-2 flex items-center gap-2">
              {isLoading ? (
                <Spinner size="small" />
              ) : (
                <Button
                  onClick={handleSubmit}
                  variant="primary"
                  disabled={isLoading}
                >
                  Iniciar sesión
                </Button>
              )}
            </div>
          </Card>
        </div>
      </AppProvider>
    </form>
  );
};

export default Login;
