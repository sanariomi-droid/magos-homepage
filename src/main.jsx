import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// 에러 방지용 안전 렌더링
const rootElement = document.getElementById("root");

if (!rootElement) {
  throw new Error("Root element not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);