import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { ThemeProvider } from "./context/ThemeContext";
import { Toaster } from "sonner";
import { Provider } from "react-redux";
import { store } from "./store";
import { LoadingBar } from "react-redux-loading-bar";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <ThemeProvider>
        <Toaster richColors position="top-right" />
        <LoadingBar
          style={{
            backgroundColor: "#9972fe",
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            zIndex: 9999,
          }}
        />
        <App />
      </ThemeProvider>
    </Provider>
  </StrictMode>
);
