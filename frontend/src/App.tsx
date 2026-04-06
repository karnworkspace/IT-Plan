import { ConfigProvider } from 'antd';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';
import { ForgotPinPage } from './pages/auth/ForgotPinPage';
import { DashboardPage } from './pages/dashboard/DashboardPage';
import { SetupPinPage } from './pages/auth/SetupPinPage';
import { ProjectsPage } from './pages/project/ProjectsPage';
import { MyTasksPage } from './pages/task/MyTasksPage';
import { ProjectDetailPage } from './pages/project/ProjectDetailPage';
import { CalendarPage } from './pages/task/CalendarPage';
import { TimelinePage } from './pages/task/TimelinePage';
import { ConfigurationPage } from './pages/admin/ConfigurationPage';
import { UserListPage } from './pages/admin/UserListPage';
import { TagTasksPage } from './pages/task/TagTasksPage';
import { MyProjectsPage } from './pages/project/MyProjectsPage';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import './App.css';

function App() {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#32BCAD',
          borderRadius: 8,
          fontFamily: "'Prompt', 'Sarabun', -apple-system, BlinkMacSystemFont, sans-serif",
        },
      }}
    >
      <BrowserRouter basename={import.meta.env.BASE_URL.replace(/\/+$/, '')}>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/setup-pin" element={<SetupPinPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/forgot-pin" element={<ForgotPinPage />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <DashboardPage />
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
            path="/projects/:projectId"
            element={
              <ProtectedRoute>
                <ProjectDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-projects"
            element={
              <ProtectedRoute>
                <MyProjectsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-tasks"
            element={
              <ProtectedRoute>
                <MyTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/calendar"
            element={
              <ProtectedRoute>
                <CalendarPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/timeline"
            element={
              <ProtectedRoute>
                <TimelinePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/tags/:tagId"
            element={
              <ProtectedRoute>
                <TagTasksPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuration"
            element={
              <ProtectedRoute>
                <ConfigurationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/configuration/users"
            element={
              <ProtectedRoute>
                <UserListPage />
              </ProtectedRoute>
            }
          />

          {/* Default Route */}
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* 404 - Redirect to dashboard */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Routes>
      </BrowserRouter>
    </ConfigProvider>
  );
}

export default App;
