import { BrowserRouter, Routes, Route } from "react-router-dom";

import MainLayout from "../layouts/main-layout";

import Dashboard from "../pages/dashboard";
import Cafes from "../pages/cafes";
import CadastrarCafe from "../pages/cadastrar-cafe";
import EditarCafe from "../pages/editar-cafe";

import Receitas from "../pages/receitas";
import CadastrarReceita from "../pages/cadastrar-receita";
import EditarReceita from "../pages/editar-receita";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <MainLayout>
                            <Dashboard />
                        </MainLayout>
                    }
                />

                <Route
                    path="/cafes"
                    element={
                        <MainLayout>
                            <Cafes />
                        </MainLayout>
                    }
                />

                <Route
                    path="/cafes/novo"
                    element={
                        <MainLayout>
                            <CadastrarCafe />
                        </MainLayout>
                    }
                />

                <Route
                    path="/cafes/:id"
                    element={
                        <MainLayout>
                            <EditarCafe />
                        </MainLayout>
                    }
                />

                <Route
                    path="/receitas"
                    element={
                        <MainLayout>
                            <Receitas />
                        </MainLayout>
                    }
                />

                <Route
                    path="/receitas/nova"
                    element={
                        <MainLayout>
                            <CadastrarReceita />
                        </MainLayout>
                    }
                />

                <Route
                    path="/receitas/:id"
                    element={
                        <MainLayout>
                            <EditarReceita />
                        </MainLayout>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;