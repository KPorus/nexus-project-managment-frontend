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
import Layout from "./components/Layout";
const RequireAuth = ({ children }: { children: React.ReactElement }) => {
  const { isAuthenticated } = useAppSelector((state: RootState) => state.auth);
  console.log(isAuthenticated);
  const location = useLocation();

  // if (isLoading)
  //   return (
  //     <div className="flex h-screen items-center justify-center">
  //       Loading...
  //     </div>
  //   );

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

const App: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
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
        </Route>
      </Routes>
    </HashRouter>
  );
};

export default App;
