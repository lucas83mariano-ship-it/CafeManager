import { useEffect, useState } from "react";

import api from "../services/api";
import "../styles/cafes.css";

function Cafes() {

    const [cafes, setCafes] = useState([]);

    useEffect(() => {

        async function carregar() {

            try {

                const resposta = await api.get("/cafes");

                setCafes(resposta.data);

            } catch (erro) {

                console.error(erro);

            }

        }

        carregar();

    }, []);

    return (

        <>
            <h1>Cafés</h1>

            <table>

                <thead>

                    <tr>
                        <th>ID</th>
                        <th>Empresa</th>
                        <th>Nome</th>
                        <th>Pontuação</th>
                    </tr>

                </thead>

                <tbody>

                    {cafes.map((cafe) => (

                        <tr key={cafe.id}>

                            <td>{cafe.id}</td>
                            <td>{cafe.empresa}</td>
                            <td>{cafe.nome_cafe}</td>
                            <td>{cafe.pontuacao}</td>

                        </tr>

                    ))}

                </tbody>

            </table>

        </>

    );

}

export default Cafes;