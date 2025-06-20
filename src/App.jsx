import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "@/pages/Login";
import Dashboard from "@/pages/Dashboard/DashboardLayout";
import NotFound from "@/pages/NotFound";
import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import { asyncPreloadProcess } from "@/store/isPreload/action";
import Loading from "@/components/ui/loading";
import COADetailLayout from "./pages/CoaDetail/CoaDetailLayout";
import COACreateLayout from "./pages/Coa/CoaCreateLayout";
import CustomerLayout from "./pages/Customers/CustomerLayout";
import ProductsLayout from "./pages/Product/ProductLayout";
import COAUpdateLayout from "./pages/Coa/CoaUpdateLayout";
import PropTypes from "prop-types";
import PrintListLayout from "./pages/Print/PrintListLayout";
import PlanningLayout from "./pages/Planning/PlanningLayout";
import PlanningCreateLayout from "./pages/Planning/PlanningCreateFormLayout";
import PlanningDetailLayout from "./pages/PlanningDetail/PlanningDetailLayout";
import PlanningDetailFormLayout from "./pages/PlanningDetail/PlanningDetailFormLayout";

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
          path="/planning"
          element={
            <ProtectedRoute>
              <PlanningLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning/create"
          element={
            <ProtectedRoute>
              <PlanningCreateLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning/update/:id"
          element={
            <ProtectedRoute>
              <PlanningCreateLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning/check/:lot"
          element={
            <ProtectedRoute>
              <PlanningDetailLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/planning/check/create/:lot"
          element={
            <ProtectedRoute>
              <PlanningDetailFormLayout />
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
          path="/COA/update/:id"
          element={
            <ProtectedRoute>
              <COAUpdateLayout />
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
        <Route
          path="/customers"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/products"
          element={
            <ProtectedRoute>
              <ProductsLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/printHistory"
          element={
            <ProtectedRoute>
              <PrintListLayout />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default App;
