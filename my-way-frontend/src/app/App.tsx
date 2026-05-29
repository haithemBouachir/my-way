import { Navigate, Route, Routes } from "react-router-dom";
import { TopNav } from "../shared/components/TopNav";
import { DashboardPage } from "../features/dashboard/DashboardPage";
import { SkillsPage } from "../features/skills/SkillsPage";
import { CareerPage } from "../features/career/CareerPage";
import { ProjectsPage } from "../features/projects/ProjectsPage";
import { FormationPage } from "../features/formation/FormationPage";
import { LanguagesPage } from "../features/languages/LanguagesPage";
import { CvPage } from "../features/cv/CvPage";
import { CvHistoryPage } from "../features/cv/CvHistoryPage";
import { ProfilePage } from "../features/profile/ProfilePage";
import { AuthPage } from "../features/auth/AuthPage";
import { NetworkingPage } from "../features/networking/NetworkingPage";
import { ProtectedRoute } from "../shared/auth/ProtectedRoute";
import { useAuth } from "../shared/auth/AuthContext";

export default function App() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="app-shell">
      {isAuthenticated ? <TopNav /> : null}

      <main className="app-main">
        <Routes>
          <Route path="/login" element={<AuthPage />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/skills"
            element={
              <ProtectedRoute>
                <SkillsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/career"
            element={
              <ProtectedRoute>
                <CareerPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <ProtectedRoute>
                <ProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/formation"
            element={
              <ProtectedRoute>
                <FormationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/networking"
            element={
              <ProtectedRoute>
                <NetworkingPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/languages"
            element={
              <ProtectedRoute>
                <LanguagesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv"
            element={
              <ProtectedRoute>
                <CvPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/cv/history"
            element={
              <ProtectedRoute>
                <CvHistoryPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to={isAuthenticated ? "/" : "/login"} replace />} />
        </Routes>
      </main>
    </div>
  );
}
