// src/hooks/useAuthToken.ts
import { useState, useEffect } from "react";
import CryptoJS from "crypto-js";
import { jwtDecode } from 'jwt-decode';

const SECRET_KEY = "tu_clave_secreta";

interface DecodedToken {
  iid: string;
  [key: string]: any;
}

export const useAuthToken = (): { token: string | null, iid: string | null } => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [iid, setIid] = useState<string | null>(null);

  useEffect(() => {
    const encryptedToken = localStorage.getItem("accessToken");
    if (encryptedToken) {
      try {
        const bytes = CryptoJS.AES.decrypt(encryptedToken, SECRET_KEY);
        const decryptedToken = bytes.toString(CryptoJS.enc.Utf8);

        const decoded: DecodedToken = jwtDecode(decryptedToken);
        setAccessToken(decryptedToken);
        setIid(decoded.iid); 

      } catch (error) {
        console.error("Error al descifrar el token", error);
      }
    }
  }, []);

  return { token: accessToken, iid };
};
