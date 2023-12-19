import useAuth from "../hooks/useAuth";
import { Outlet, Navigate, useLocation } from "react-router-dom";

const RequireAuth = ({ allowedRoles }) => {
  const { auth } = useAuth()
  const location = useLocation();
  return (
    allowedRoles.includes(auth.role) ?
      <Outlet />
      : auth?.accessToken ?
        <Navigate to={`/unauthorized`} replace />
        : <Navigate to={`${allowedRoles.includes('seller') ? '/seller/login' : '/login'}`} state={{ from: location }} replace />

    // allowedRoles.includes

  );
}

export default RequireAuth;