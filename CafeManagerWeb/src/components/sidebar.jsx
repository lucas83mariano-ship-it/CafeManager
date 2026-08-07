import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { useState } from "react";
import LoginForm from "./LoginForm";
import "./sidebar.css";

function Sidebar() {

    const [mostrarLogin, setMostrarLogin] = useState(false);

    const navigate = useNavigate();

    const {
        usuario,
        logout,
        isAuthenticated,
    } = useAuth();

    function sair() {

        logout();

        setMostrarLogin(false);

        navigate("/");

    }

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
                    </>
                )}

                <hr />

            </nav>

        </aside>

    );

}

export default Sidebar;