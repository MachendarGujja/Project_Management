import { Navigate } from "react-router-dom";
import { authManage } from "../context/AuthContext";

const AdminRoute = ({ children }) => {
    const { token, user,loading } = authManage();
    if (loading) {
        return <p>Loading...</p>; // or spinner
    }

    if (!token) {
        return <Navigate to="/login" />;
    }
//     console.log("AdminRoute → token:", token);
// console.log("AdminRoute → user:", user);
// console.log("AdminRoute → loading:", loading);
    if (user?.role !== "admin") {
        return <Navigate to="/" />;
    }

    return children;
};

export default AdminRoute;