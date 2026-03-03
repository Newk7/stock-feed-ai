import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import LoginPage from "./components/auth/LoginPage";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import News from "./pages/News";
import Sectors from "./pages/Sectors";
import Screener from "./pages/Screener";
import Saved from "./pages/Saved";
import Settings from "./pages/Settings";

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <Layout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/news" element={<News />} />
                <Route path="/sectors" element={<Sectors />} />
                <Route path="/screener" element={<Screener />} />
                <Route path="/saved" element={<Saved />} />
                <Route path="/settings" element={<Settings />} />
              </Routes>
            </Layout>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
