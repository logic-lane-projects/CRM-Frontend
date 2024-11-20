import React, { useState, useEffect } from "react";
import {
  AppProvider,
  Card,
  TextField,
  Button,
  Spinner,
  Modal,
  TextContainer,
} from "@shopify/polaris";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "./../../../firebase";
import { Toast } from "../../components/Toast/toast";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | undefined>(undefined);
  const [passwordError, setPasswordError] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingReset, setIsLoadingReset] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetEmailError, setResetEmailError] = useState<string | undefined>(
    undefined
  );
  const API_URL = import.meta.env.VITE_API_URL;

  const verifyToken = async (tokens: string): Promise<boolean> => {
    const raw = JSON.stringify({ token: tokens });
    const requestOptions: RequestInit = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: raw,
      redirect: "follow" as RequestRedirect,
    };

    try {
      const response = await fetch(`${API_URL}verifyToken`, requestOptions);
      if (!response.ok) throw new Error("Error en la solicitud");
      const data = await response.json();
      console.log("Respuesta del servidor:", data);
      return true;
    } catch (error) {
      console.error("Error:", error);
      return false;
    }
  };

  useEffect(() => {
    const accessToken = localStorage.getItem("accessTokenCRM");
    const storedEmail = localStorage.getItem("email");

    if (accessToken && storedEmail) {
      navigate("/inicio");
    }
  }, [navigate]);

  const handleSubmit = async (event?: React.FormEvent) => {
    if (event) event.preventDefault();
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
      const isUser = await verifyToken(token);

      if (isUser) {
        localStorage.setItem("accessTokenCRM", token);
        if (user.email) localStorage.setItem("email", user.email);
        setIsLoading(false);
        navigate("/inicio");
      } else {
        throw new Error("El usuario no tiene un token");
      }
    } catch (error) {
      console.error("Error en el inicio de sesión:", error);
      setEmailError("Credenciales incorrectas o el usuario no existe.");
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setIsLoadingReset(true);
    if (!resetEmail) {
      setIsLoadingReset(false);
      setResetEmailError(
        "Por favor ingrese su correo electrónico para restablecer la contraseña."
      );
      return;
    }

    try {
      await sendPasswordResetEmail(auth, resetEmail);
      Toast.fire({
        icon: "success",
        title: "Correo de restablecimiento enviado",
      });
      setIsResetModalOpen(false);
      setResetEmail("");
      setIsLoadingReset(false);
    } catch (error) {
      setIsLoadingReset(false);
      console.error("Error al enviar el correo de restablecimiento:", error);
      setResetEmailError("No se pudo enviar el correo de restablecimiento.");
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
            <p
              className="text-blue-600 cursor-pointer mt-2"
              onClick={() => setIsResetModalOpen(true)}
            >
              Olvidé mi contraseña
            </p>
          </Card>
        </div>
        {isResetModalOpen && (
          <Modal
            open={isResetModalOpen}
            onClose={() => setIsResetModalOpen(false)}
            title="Restablecer contraseña"
            primaryAction={{
              disabled: isLoadingReset,
              content: isLoadingReset ? "Restableciendo..." : "Restablecer",
              onAction: handlePasswordReset,
            }}
            secondaryActions={[
              {
                content: "Cancelar",
                onAction: () => setIsResetModalOpen(false),
              },
            ]}
          >
            <Modal.Section>
              <TextContainer>
                <p>
                  Ingrese su correo electrónico para recibir un enlace de
                  restablecimiento de contraseña.
                </p>
                <TextField
                  label="Correo electrónico"
                  value={resetEmail}
                  onChange={(value) => {
                    setResetEmail(value);
                    setResetEmailError(undefined);
                  }}
                  type="email"
                  autoComplete="email"
                  error={resetEmailError}
                />
              </TextContainer>
            </Modal.Section>
          </Modal>
        )}
      </AppProvider>
    </form>
  );
};

export default Login;
