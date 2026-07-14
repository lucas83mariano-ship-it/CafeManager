import ReceitaRow from "./receitas-row";

function ReceitasTable({

    receitas,
    onDelete,

}) {

    return (

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Método</th>
                    <th>Café</th>
                    <th>Proporção</th>
                    <th>Água</th>
                    <th>Café (g)</th>
                    <th>Data</th>
                    <th>Ações</th>

                </tr>

            </thead>

            <tbody>

                {receitas.map((receita) => (

                    <ReceitaRow

                        key={receita.id}

                        receita={receita}

                        onDelete={onDelete}

                    />

                ))}

            </tbody>

        </table>

    );

}

export default ReceitasTable;