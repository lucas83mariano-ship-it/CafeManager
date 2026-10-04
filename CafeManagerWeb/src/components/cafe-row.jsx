import { useNavigate } from "react-router-dom";
import { deletarCafe } from "../services/cafe-service";
import IconButton from "./ui/icon-button";

function CafeRow({

    cafe,
    onDelete,

}) {

    const navigate = useNavigate();

    function editarCafe() {

        navigate(`/cafes/editar/${cafe.id}`);

    }

    async function excluirCafe() {

        const confirmar = window.confirm(

            `Deseja excluir "${cafe.nome_cafe}"?`

        );

        if (!confirmar) {

            return;

        }

        try {

            await deletarCafe(cafe.id);

            onDelete();

        }

        catch (erro) {

            console.error(erro);

            alert("Erro ao excluir café.");

        }

    }

    function clicarEditar(event) {

        event.stopPropagation();

        editarCafe();

    }

    function clicarExcluir(event) {

        event.stopPropagation();

        excluirCafe();

    }

    return (

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

    );

}

export default CafeRow;