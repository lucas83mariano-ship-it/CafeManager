import { Navigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";

function AdminRoute({ children }) {

    const { usuario } = useAuth();

    if (!usuario) {

        return <Navigate to="/perfil" />;

    }

    if (usuario.role !== "admin") {

        return <Navigate to="/" />;

    }

    return children;

}

export default AdminRoute;