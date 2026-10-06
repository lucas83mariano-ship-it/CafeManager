import { useNavigate } from "react-router-dom";
import { deletarCafe } from "../services/cafe-service";
import IconButton from "./ui/icon-button";
import { useState } from "react";
import Mensagem from "./mensagem";
import Confirmacao from "./ui/confirmacao";

function CafeRow({

    cafe,
    onDelete,

}) {

    const [mensagem, setMensagem] = useState(null);

    const navigate = useNavigate();

    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    function editarCafe() {

        navigate(`/cafes/editar/${cafe.id}`);

    }

    async function excluirCafe() {

        try {

            await deletarCafe(cafe.id);

            setMostrarConfirmacao(false);

            onDelete();

        }

        catch (erro) {

            console.error(erro);

            setMostrarConfirmacao(false);

            setMensagem({
                texto:
                    erro.response?.data?.detail ||
                    erro.message ||
                    "Erro ao excluir café.",
                tipo: "erro",
            });

        }

    }

    function clicarEditar(event) {

        event.stopPropagation();

        editarCafe();

    }

    function clicarExcluir(event) {

        event.stopPropagation();

        setMostrarConfirmacao(true);

    }

    return (

        <>

            <tr
                onClick={editarCafe}
                style={{ cursor: "pointer" }}
            >

                <td>{cafe.usuario_id}</td>
                
                <td>{cafe.id}</td>

                <td>{cafe.empresa}</td>

                <td>{cafe.nome_cafe}</td>

                <td>{cafe.pontuacao ?? "-"}</td>

                <td>

                    <Mensagem 
                        mensagem={mensagem?.texto}
                        tipo={mensagem?.tipo}
                        onClose={() => setMensagem(null)} 
                    />
                    
                    <IconButton
                        title="Editar café"
                        onClick={clicarEditar}
                    >

                        Editar

                    </IconButton>

                    <IconButton
                        title="Excluir café"
                        onClick={clicarExcluir}
                    >

                        Excluir

                    </IconButton>

                </td>

            </tr>

            {mostrarConfirmacao && (

                <Confirmacao

                    titulo="Confirmar exclusão"

                    mensagem={`Deseja excluir "${cafe.nome_cafe}"?`}

                    onConfirm={excluirCafe}

                    onCancel={() => setMostrarConfirmacao(false)}

                />

            )}

        </>

    );

}

export default CafeRow;