import { Navigate } from 'react-router-dom';
import { authManage } from '../context/AuthContext';

const ProtectedRoutes = ({children}) => {
    const {token} = authManage();
    if(!token) {
        return <Navigate to="/login" replace />
    }
    return children;
}

export default ProtectedRoutes;