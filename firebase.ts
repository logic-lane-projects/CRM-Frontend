// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const apikey = import.meta.env.VITE_APIKEY;
const authDomain = import.meta.env.VITE_AUTHDOMAIN;
const projectId = import.meta.env.VITE_PROJECTID;
const storageBucket = import.meta.env.VITE_STORAGEBUCKER;
const messagingSenderId = import.meta.env.VITE_MESSAGINSENDERID;
const appId = import.meta.env.VITE_APPID;
const measurementId = import.meta.env.VITE_MEASUREMENTID;

const firebaseConfig = {
  apiKey: apikey,
  authDomain: authDomain,
  projectId: projectId,
  storageBucket: storageBucket,
  messagingSenderId: messagingSenderId,
  appId: appId,
  measurementId: measurementId,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
