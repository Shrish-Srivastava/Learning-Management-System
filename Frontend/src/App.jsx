import { Route, Routes } from "react-router-dom";
import { ShellLayout } from "./components/ShellLayout";
import { AdminRoute, ProtectedRoute } from "./components/RouteGuards";
import { AdminPage } from "./pages/AdminPage";
import { CoursePage } from "./pages/CoursePage";
import { DashboardPage } from "./pages/DashboardPage";
import { HomePage } from "./pages/HomePage";
import { LearnPage } from "./pages/LearnPage";
import { LoginPage } from "./pages/LoginPage";
import { PurchasedCoursesPage } from "./pages/PurchasedCoursesPage";
import { RegisterPage } from "./pages/RegisterPage";

function App() {
  return (
    <ShellLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/courses/:slug" element={<CoursePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/dashboard/purchased"
          element={
            <ProtectedRoute>
              <PurchasedCoursesPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/learn/:slug/:lessonId"
          element={
            <ProtectedRoute>
              <LearnPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminPage />
            </AdminRoute>
          }
        />
      </Routes>
    </ShellLayout>
  );
}

export default App;
