import { NavLink } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import "./sidebar.css";

function Sidebar() {

    const {
        usuario,
        isAuthenticated,
    } = useAuth();

    return (

        <aside className="sidebar">

            <h2>Cafe Manager</h2>

            <nav>

                <NavLink to="/">
                    Calculadora
                </NavLink>

                {isAuthenticated && (
                    <>
                        <NavLink to="/cafes">
                            Cafés
                        </NavLink>
                                
                        <NavLink to="/receitas">
                            Receitas
                        </NavLink>
                                
                        {usuario?.role === "admin" && (
                            <>
                                <hr />
                        
                                <NavLink to="/usuarios">
                                    Usuários
                                </NavLink>
                            </>
                        )}
                    </>
                )}

                <hr />

            </nav>

        </aside>

    );

}

export default Sidebar;