import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { AppProvider } from "@shopify/polaris";
import App from "./App.tsx";
import "./index.css";
import "@shopify/polaris/build/esm/styles.css";

const root = createRoot(document.getElementById("root")!);

root.render(
  <StrictMode>
    <AppProvider i18n={{}}>
      <App />
    </AppProvider>
  </StrictMode>
);
