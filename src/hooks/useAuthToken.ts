import { useState, useEffect } from "react";
import { getUserInfo } from "../services/auth";

interface UserInfo {
  id: string;
  role: string;
}

export const useAuthToken = () => {
  const [emailOnline, setEmailOnline] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<UserInfo | null>(null); 
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("email");

    if (token) {
      setEmailOnline(token);

      getUserInfo(token)
        .then((data) => {
          setUserInfo(data?.data || null);
          setLoading(false);
        })
        .catch(() => {
          setError("Error fetching user information");
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  return { emailOnline, userInfo, loading, error };
};
