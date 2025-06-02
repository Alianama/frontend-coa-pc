import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard/DashboardLayout";
import NotFound from "@/pages/NotFound";
import COAListLayout from "@/pages/Coa/CoaListLayout";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { asyncPreloadProcess } from "@/store/isPreload/action";
import Loading from "@/components/ui/loading";
import COADetailLayout from "./pages/CoaDetail/CoaDetailLayout";
import COACreateLayout from "./pages/Coa/CoaCreateLayout";
const ProtectedRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.authUser);
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const isAuthenticated = useSelector((state) => state.authUser);
  return isAuthenticated ? <Navigate to="/dashboard" /> : children;
};

function App() {
  const isPreload = useSelector((state) => state.isPreload);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(asyncPreloadProcess());
  }, [dispatch]);

  if (isPreload) {
    return <Loading />;
  }

  return (
    <Router>
      <Routes>
        <Route
          path="/login"
          element={
            <PublicRoute>
              <Login />
            </PublicRoute>
          }
        />
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/COA"
          element={
            <ProtectedRoute>
              <COAListLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/COA/create"
          element={
            <ProtectedRoute>
              <COACreateLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/COA/detail/:id"
          element={
            <ProtectedRoute>
              <COADetailLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
