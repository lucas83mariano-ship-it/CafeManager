import { useState } from "react";

import Card from "../components/ui/card";
import Loading from "../components/ui/loading";
import CafesTable from "../components/cafes-table";
import Input from "../components/ui/input";
import useCafes from "../hooks/use-cafes";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import "../styles/cafes.css";

function Cafes() {

    const {

        cafes,
        loading,
        erro,
        carregar,

    } = useCafes();

    const [busca, setBusca] = useState("");

    const navigate = useNavigate();

    const cafesFiltrados = cafes.filter((cafe) => {

        const termo = busca.trim().toLowerCase();

        if (!termo) {

            return true;

        }

        return (
            String(cafe.id) === termo ||
            cafe.nome_cafe
                .toLowerCase()
                .includes(termo)
        );

    });

    if (loading) {

        return <Loading />;

    }

    if (erro) {
        return (
            <Card>
                <p>{erro}</p>
            </Card>
        );
    }

    return (

        <>

            <div className="page-header">

                <h1>Cafés</h1>

                <Button
                    onClick={() => navigate("/cafes/cadastrar")}
                >

                    Novo Café

                </Button>

            </div>

            <Input
                label="Buscar café"
                id="busca-cafe"
                placeholder="Digite o ID ou nome do café"
                value={busca}
                onChange={(e) => setBusca(e.target.value)}
            />

            <p className="table-info">

                {busca.trim()
                    ? `Exibindo ${cafesFiltrados.length} de ${cafes.length} cafés`
                    : `Total de cafés: ${cafes.length}`
                }

            </p>

            <Card>

                <CafesTable

                    cafes={cafesFiltrados}

                    onDelete={carregar}

                />

            </Card>

        </>

    );

}

export default Cafes;