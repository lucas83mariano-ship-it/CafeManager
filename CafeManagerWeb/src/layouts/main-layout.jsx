import Header from "../components/header";
import Sidebar from "../components/sidebar";

import "./main-layout.css";

function MainLayout({ children }) {
    return (
        <div className="layout">

            <Sidebar />

            <div className="content">

                <Header />

                <main className="page">

                    {children}

                </main>

            </div>

        </div>
    );
}

export default MainLayout;