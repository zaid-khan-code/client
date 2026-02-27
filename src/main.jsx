import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ExtraEmp from "./pages/ExtraEmp.jsx";
import Job from "./pages/Job.jsx";

createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/extraemp" element={<ExtraEmp />} />
      <Route path="/jobs" element={<Job />} />
      <Route path="*" element={<div>404 Not Found</div>} />
    </Routes>
  </BrowserRouter>,
);
