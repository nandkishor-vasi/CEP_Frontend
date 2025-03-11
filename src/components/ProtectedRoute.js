import { useAuth}   from   "../context/AuthContext";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({allowedRoles}) => {
    const {user} = useAuth();
    console.log("User Role:", user?.role?.toUpperCase());
    console.log("Allowed Roles:", allowedRoles);
    if(!user || !allowedRoles.includes(user.role?.toUpperCase())){
        return  <Navigate to="/auth" replace />;
    } 
    return <Outlet />;
};

export default ProtectedRoute;
