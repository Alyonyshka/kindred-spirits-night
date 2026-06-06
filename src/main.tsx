import { createRoot } from "react-dom/client";
import { HelmetProvider } from "react-helmet-async";
import App from "./App.tsx";
import "./index.css";
import { initSentry, Sentry } from "./lib/sentry";

initSentry();

createRoot(document.getElementById("root")!).render(
  <Sentry.ErrorBoundary fallback={<div style={{ padding: 24, color: "#fff" }}>Что-то пошло не так. Мы уже получили отчёт об ошибке.</div>}>
    <HelmetProvider>
      <App />
    </HelmetProvider>
  </Sentry.ErrorBoundary>
);
