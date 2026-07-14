function ReceitaRow({

    receita,

}) {

    return (

        <tr>

            <td>{receita.id}</td>

            <td>{receita.metodo}</td>

            <td>{receita.cafe_id}</td>

            <td>{receita.proporcao}</td>

            <td>{receita.agua_ml}</td>

            <td>{receita.cafe_g}</td>

            <td>{receita.data_receita}</td>

            <td>

                —

            </td>

        </tr>

    );

}

export default ReceitaRow;