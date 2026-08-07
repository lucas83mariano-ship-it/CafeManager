import { Link } from "react-router-dom";
import { useAuth } from "../context/auth-context";

import "./header.css";

function Header() {

    const {
        usuario,
        isAuthenticated,
    } = useAuth();

    return (

        <header className="header">

            <div className="header-title">

                Sistema de gerenciamento de cafés

            </div>

            <div className="header-user">

                <Link to="/perfil">

                    {isAuthenticated
                        ? usuario?.nome
                        : "Perfil"}

                    <br />

                    {isAuthenticated
                        ? usuario?.email
                        : "Perfil"}

                </Link>

            </div>

        </header>

    );

}

export default Header;