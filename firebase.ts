// src/firebase.ts
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyAIMmpZTrIS70QMvgTlbNXSBXuvNJHG3Os",
  authDomain: "crm-dev-99767.firebaseapp.com",
  projectId: "crm-dev-99767",
  storageBucket: "crm-dev-99767.appspot.com",
  messagingSenderId: "867591998050",
  appId: "1:867591998050:web:aacace4f3fe58bd9ba1f3b",
  measurementId: "G-EDSCBLWFXC"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
