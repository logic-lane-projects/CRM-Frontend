// src/services/auth.ts
import {
  signInWithEmailAndPassword,
  signOut,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "./../../firebase";
const APP_URL = import.meta.env.VITE_API_URL;

export const login = (email: string, password: string) => {
  return signInWithEmailAndPassword(auth, email, password);
};

export const logout = () => {
  return signOut(auth);
};

export const register = (email: string, password: string) => {
  return createUserWithEmailAndPassword(auth, email, password);
};

export const getUserInfo = async (email: string) => {
  try {
    const response = await fetch(`${APP_URL}users/find/email`, {
      method: "POST", 
      headers: {
        "Content-Type": "application/json",  
      },
      body: JSON.stringify({ email }),  
    });
    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return await response.json();  
  } catch (error) {
    return error;
  }
};
