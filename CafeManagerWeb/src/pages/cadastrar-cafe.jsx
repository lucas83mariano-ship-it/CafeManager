import { cadastrarCafe } from "../services/cafe-service";
import { useNavigate } from "react-router-dom";
import Card from "../components/ui/card";
import CafeForm from "../components/cafe-form";

function CadastrarCafe() {

    const navigate = useNavigate();

    async function salvar(cafe) {

        try {

            await cadastrarCafe(cafe);

            navigate("/cafes"); 

        } 
        catch (erro) {

            console.error(erro);

            alert("Erro ao cadastrar.");

        }

    }

    return (

        <>

            <h1>Novo Café</h1>

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