import { BrowserRouter, Routes, Route } from "react-router-dom";
import MainLayout from "../layouts/main-layout";
import Usuarios from "../pages/usuarios";
import Cafes from "../pages/cafes";
import CadastrarCafe from "../pages/cadastrar-cafe";
import EditarCafe from "../pages/editar-cafe";
import Calculadora from "../pages/calculadora";
import Receitas from "../pages/receitas";
import CadastrarReceita from "../pages/cadastrar-receita";
import EditarReceita from "../pages/editar-receita";
import Perfil from "../pages/perfil";
import AdminRoute from "../components/admin-route";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={
                        <MainLayout>
                            <Calculadora />
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
                    path="/cafes/cadastrar"
                    element={
                        <MainLayout>
                            <CadastrarCafe />
                        </MainLayout>
                    }
                />

                <Route
                    path="/cafes/editar/:id"
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
                    path="/receitas/cadastrar"
                    element={
                        <MainLayout>
                            <CadastrarReceita />
                        </MainLayout>
                    }
                />

                <Route
                    path="/receitas/editar/:id"
                    element={
                        <MainLayout>
                            <EditarReceita />
                        </MainLayout>
                    }
                />

                <Route
                    path="/calculadora"
                    element={
                        <MainLayout>
                            <Calculadora />
                        </MainLayout>
                    }
                />

                <Route
                    path="/perfil"
                    element={
                        <MainLayout>
                            <Perfil />
                        </MainLayout>
                    }
                />

                <Route
                    path="/usuarios"
                    element={
                        <AdminRoute>
                            <MainLayout>
                                <Usuarios />
                            </MainLayout>
                        </AdminRoute>
                    }
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;