import { useState, useEffect } from "react";
import { getUserInfo } from "../services/auth";

interface UserInfo {
  city: string | null;
  id: string;
  role: string;
  permisos?: string[];
  oficinas_permitidas?: string[];
  numero_telefonico?: string;
  name?: string;
  paternal_surname?: string;
}

export const useAuthToken = () => {
  const [emailOnline, setEmailOnline] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [permisos, setPermisos] = useState<string[] | undefined>(undefined);

  useEffect(() => {
    const token = localStorage.getItem("email");

    if (token) {
      setEmailOnline(token);
      getUserInfo(token)
        .then((data) => {
          setUserInfo(data?.data || null);
          setPermisos(data?.data?.permisos || undefined);
          setLoading(false);
          console.log("data", data);
        })
        .catch(() => {
          setError("Error fetching user information");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { emailOnline, userInfo, permisos, loading, error };
};
