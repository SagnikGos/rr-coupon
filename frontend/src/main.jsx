import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { TooltipProvider } from "@radix-ui/react-tooltip"; // Import TooltipProvider
import Login from "./pages/login.jsx";
import Dashboard from "./pages/dashboard.jsx";
import "./index.css";
import User from "./pages/user.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <TooltipProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<User/>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </TooltipProvider>
);
