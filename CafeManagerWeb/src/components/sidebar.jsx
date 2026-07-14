import { NavLink } from "react-router-dom";

import "./sidebar.css";

function Sidebar() {

    return (

        <aside className="sidebar">

            <h2>Cafe Manager</h2>

            <nav>

                <NavLink to="/">
                    Dashboard
                </NavLink>

                <NavLink to="/cafes">
                    Cafés
                </NavLink>

                <NavLink to="/receitas">
                    Receitas
                </NavLink>

                <NavLink to="/calculadora">
                    Calculadora
                </NavLink>

            </nav>

        </aside>

    );

}

export default Sidebar;