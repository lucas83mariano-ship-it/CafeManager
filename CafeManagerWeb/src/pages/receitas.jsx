import { useNavigate } from "react-router-dom";

import Card from "../components/ui/card";
import Button from "../components/ui/button";
import Loading from "../components/ui/loading";

import ReceitasTable from "../components/receitas-table";

import useReceitas from "../hooks/use-receitas";

import "../styles/receitas.css";

function Receitas() {

    const {

        receitas,
        loading,
        erro,
        carregar,

    } = useReceitas();

    const navigate = useNavigate();

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

                <h1>Receitas</h1>

                <Button
                    onClick={() => navigate("/receitas/cadastrar")}
                >

                    Nova Receita

                </Button>

            </div>

            <p className="table-info">

                Total de receitas: {receitas.length}

            </p>

            <Card>

                <ReceitasTable

                    receitas={receitas}

                    onDelete={carregar}

                />

            </Card>

        </>

    );

}

export default Receitas;