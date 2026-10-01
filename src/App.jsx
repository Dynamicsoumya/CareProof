import { Navigate, Route, Routes } from "react-router-dom";
import { Shell } from "./components/Shell.jsx";
import Landing from "./pages/Landing.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Patients from "./pages/Patients.jsx";
import Patient from "./pages/Patient.jsx";
import Standard from "./pages/Standard.jsx";
import Equipment from "./pages/Equipment.jsx";
import Caregivers from "./pages/Caregivers.jsx";
import Passport from "./pages/Passport.jsx";
import Incident from "./pages/Incident.jsx";
import Research from "./pages/Research.jsx";
import Evidence from "./pages/Evidence.jsx";
import Present from "./pages/Present.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/present" element={<Present />} />
      <Route element={<Shell />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<Patients />} />
        <Route path="/patients/:id" element={<Patient />} />
        <Route path="/standard" element={<Standard />} />
        <Route path="/equipment" element={<Equipment />} />
        <Route path="/caregivers" element={<Caregivers />} />
        <Route path="/passport" element={<Passport />} />
        <Route path="/passport/:id" element={<Passport />} />
        <Route path="/incident" element={<Incident />} />
        <Route path="/research" element={<Research />} />
        <Route path="/evidence" element={<Evidence />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
