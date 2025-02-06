import App from "./App";
import React from "react";
import ReactDOM from "react-dom/client";
import "./styles/index.css";
import { disableReactDevTools } from "@fvilers/disable-react-devtools";

if (process.env.NODE_ENV === "production") disableReactDevTools();
ReactDOM.createRoot(document.getElementById("root")).render(<App />);
