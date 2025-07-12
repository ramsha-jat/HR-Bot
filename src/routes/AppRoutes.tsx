import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "@/pages/LoginPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage"; // ✅ Import
import UserDashboardPage from "@/pages/UserDashboardPage"; // ✅ Import
import UploadDocumentsPage from "@/pages/UploadDocumentsPage";
import AssistantPage from "@/pages/assistant";
import DocumentAnalysis from "@/pages/DocumentAnalysis";
import HrAssistantPage from "@/pages/hr-assistant";
import ManageUsersPage from '@/pages/ManageUsersPage';


const AppRoutes = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/admin/dashboard" element={<AdminDashboardPage />} /> {/* ✅ */}
      <Route path="/user/dashboard" element={<UserDashboardPage />} /> {/* ✅ */}
      <Route path="/upload" element={<UploadDocumentsPage />} />
      <Route path="/assistant" element={<AssistantPage />} />
      <Route path="/document-analysis" element={<DocumentAnalysis />} />
      <Route path="/hr-assistant" element={<HrAssistantPage />} />
      <Route path="/admin/users" element={<ManageUsersPage />} />
    </Routes>
  </BrowserRouter>
);

export default AppRoutes;
