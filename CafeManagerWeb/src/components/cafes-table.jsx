import { useState } from "react";

import CafeRow from "./cafe-row";

function CafesTable({
    cafes,
    onDelete,
}) {

    const [colunaOrdenacao, setColunaOrdenacao] = useState(null);

    const [direcaoOrdenacao, setDirecaoOrdenacao] = useState("asc");

    function ordenarPor(coluna) {

        if (colunaOrdenacao === coluna) {

            setDirecaoOrdenacao(
                direcaoOrdenacao === "asc"
                    ? "desc"
                    : "asc"
            );

            return;

        }

        setColunaOrdenacao(coluna);

        setDirecaoOrdenacao("asc");

    }

    const cafesOrdenados = [...cafes].sort((a, b) => {

        if (!colunaOrdenacao) {

            return 0;

        }

        let valorA = a[colunaOrdenacao];
        let valorB = b[colunaOrdenacao];

        if (valorA == null) {

            valorA = "";

        }

        if (valorB == null) {

            valorB = "";

        }

        if (
            typeof valorA === "string" &&
            typeof valorB === "string"
        ) {

            const resultado = valorA.localeCompare(
                valorB,
                "pt-BR",
                {
                    sensitivity: "base",
                }
            );

            return direcaoOrdenacao === "asc"
                ? resultado
                : -resultado;

        }

        if (valorA < valorB) {

            return direcaoOrdenacao === "asc"
                ? -1
                : 1;

        }

        if (valorA > valorB) {

            return direcaoOrdenacao === "asc"
                ? 1
                : -1;

        }

        return 0;

    });

    function indicadorOrdenacao(coluna) {

        if (colunaOrdenacao !== coluna) {

            return "";

        }

        return direcaoOrdenacao === "asc"
            ? " ↑"
            : " ↓";

    }

    return (

        <table>

            <thead>

                <tr>

                    <th
                        onClick={() => ordenarPor("usuario_id")}
                        style={{ cursor: "pointer" }}
                    >
                        Autor
                        {indicadorOrdenacao("usuario_id")}
                    </th>

                    <th
                        onClick={() => ordenarPor("id")}
                        style={{ cursor: "pointer" }}
                    >
                        ID
                        {indicadorOrdenacao("id")}
                    </th>

                    <th
                        onClick={() => ordenarPor("empresa")}
                        style={{ cursor: "pointer" }}
                    >
                        Empresa
                        {indicadorOrdenacao("empresa")}
                    </th>

                    <th
                        onClick={() => ordenarPor("nome_cafe")}
                        style={{ cursor: "pointer" }}
                    >
                        Nome
                        {indicadorOrdenacao("nome_cafe")}
                    </th>

                    <th
                        onClick={() => ordenarPor("pontuacao")}
                        style={{ cursor: "pointer" }}
                    >
                        Pontuação
                        {indicadorOrdenacao("pontuacao")}
                    </th>

                    <th>Ações</th>

                </tr>

            </thead>

            <tbody>

                {cafesOrdenados.length === 0 ? (

                    <tr>

                        <td
                            colSpan="6"
                            style={{ textAlign: "center" }}
                        >

                            Nenhum café cadastrado.

                        </td>

                    </tr>

                ) : (

                    cafesOrdenados.map((cafe) => (

                        <CafeRow
                            key={cafe.id}
                            cafe={cafe}
                            onDelete={onDelete}
                        />

                    ))

                )}

            </tbody>

        </table>

    );

}

export default CafesTable;