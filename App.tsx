import React from "react";
import {
  HashRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import Login from "./pages/Login";
import type { RootState } from "./store/store";
import { useAppSelector } from "./store/hooks";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import Users from "./pages/Users";
import Register from "./pages/Register";
import Layout from "./components/Layout";
import { Role } from "./types";

const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const RequireRole = ({
  children,
  roles,
}: {
  children: React.ReactElement;
  roles: Role[];
}) => {
  const { user } = useAppSelector((state: RootState) => state.auth);

  if (!user || !roles.includes(user.role as Role)) {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/invite" element={<Register />} />
        <Route path="/login" element={<Login />} />

        <Route
          path="/"
          element={
            <RequireAuth>
              <Layout />
            </RequireAuth>
          }
        >
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="projects" element={<Projects />} />

          <Route
            path="users"
            element={
              <RequireRole roles={[Role.ADMIN]}>
                <Users />
              </RequireRole>
            }
          />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </HashRouter>
  );
};

export default App;
