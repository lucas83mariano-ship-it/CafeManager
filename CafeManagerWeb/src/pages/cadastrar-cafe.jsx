import { cadastrarCafe } from "../services/cafe-service";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/card";
import CafeForm from "../components/cafe-form";
import Mensagem from "../components/mensagem";

function CadastrarCafe() {

    const navigate = useNavigate();
    const [mensagem, setMensagem] = useState(null);

    async function salvar(cafe) {

        try {

            await cadastrarCafe(cafe);

            navigate("/cafes"); 

        } 
        catch (erro) {

            console.error(erro);

            setMensagem({
                texto:
                    erro.response?.data?.detail ||
                    erro.message ||
                    "Erro ao cadastrar.",
                tipo: "erro",
            });

        }

    }

    return (

        <>

            <h1>Novo Café</h1>

            <Mensagem 
                mensagem={mensagem?.texto}
                tipo={mensagem?.tipo}
                onClose={() => setMensagem(null)} 
            />

            <Card>

                <CafeForm 
                    onSubmit={salvar}
                    textoBotao="Cadastrar"
                    onCancel={() => navigate("/cafes")}
                />

            </Card>

        </>

    );

}

export default CadastrarCafe;