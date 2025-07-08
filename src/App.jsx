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
import CustomerLayout from "./pages/Customers/CustomerLayout";
import ProductsLayout from "./pages/Product/ProductLayout";
import PropTypes from "prop-types";
import PrintListLayout from "./pages/Print/PrintListLayout";
import PlanningLayout from "./pages/Planning/PlanningLayout";
import PlanningCreateLayout from "./pages/Planning/PlanningCreateFormLayout";
import PlanningDetailLayout from "./pages/PlanningDetail/PlanningDetailLayout";
import PlanningDetailFormLayout from "./pages/PlanningDetail/PlanningDetailFormLayout";
import ProductStandardsLayout from "./pages/ProductStandards/ProductStandardLayout";
import PrintLayout from "./pages/Print/PrintLayout";
import ColorTrendLayout from "./pages/Trend/TrendColorLayout";
import PreviewLayout from "./pages/Print/PreviewLayout";
import UsersLayout from "./pages/Users/UsersLayout";

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
          path="/products/standard/:id"
          element={
            <ProtectedRoute>
              <ProductStandardsLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/coa-history"
          element={
            <ProtectedRoute>
              <PrintListLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print/print/:id"
          element={
            <ProtectedRoute>
              <PrintLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/print/preview/:id"
          element={
            <ProtectedRoute>
              <PreviewLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/trend"
          element={
            <ProtectedRoute>
              <ColorTrendLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="/users"
          element={
            <ProtectedRoute>
              <UsersLayout />
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
