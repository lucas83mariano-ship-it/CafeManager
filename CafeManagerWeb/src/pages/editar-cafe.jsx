import { useNavigate, useParams } from "react-router-dom";
import Button from "../components/ui/button";
import Card from "../components/ui/card";
import Loading from "../components/ui/loading";
import CafeForm from "../components/cafe-form";

import useCafe from "../hooks/use-cafe";

import { atualizarCafe } from "../services/cafe-service";

function EditarCafe() {

    const navigate = useNavigate();

    const { id } = useParams();

    const {

        cafe,
        loading,
        erro,

    } = useCafe(id);

    async function salvar(dados) {

        try {

            await atualizarCafe(id, dados);

            navigate("/cafes");

        }

        catch (erroAtualizacao) {

            console.error(erroAtualizacao);

            alert("Erro ao atualizar.");

        }

    }

    if (loading) {
        return <Loading />;
    }

    if (erro) {
        return <p>{erro}</p>;
    }

    return (

        <>

            <h1>Editar Café</h1>

            <Card>

                <CafeForm
                    initialData={cafe}
                    onSubmit={salvar}
                    onCancel={() => navigate("/cafes")}
                    textoBotao="Atualizar"
                />

            </Card>

        </>

    );

}

export default EditarCafe;