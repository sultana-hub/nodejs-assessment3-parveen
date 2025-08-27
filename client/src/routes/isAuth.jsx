// import React from "react";
// import { Navigate,Outlet } from "react-router-dom";

// const ProtectedRoute=()=>{
//    const isAuthentication=window.sessionStorage.getItem("token")
//    return isAuthentication?<Outlet/>:<Navigate to ="error"/>
// }

// export default ProtectedRoute

import React from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const ProtectedRoute = () => {
  const token = window.sessionStorage.getItem("token");
  const location = useLocation();

  return token ? (
    <Outlet />
  ) : (
    <Navigate to={`/error?message=session-expired&redirect=${location.pathname}`} replace />
  );
};

export default ProtectedRoute;
