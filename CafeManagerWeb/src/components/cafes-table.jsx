import CafeRow from "./cafe-row";

function CafesTable({ 
    cafes, 
    onDelete, 
}) {

    return (

        <table>

            <thead>

                <tr>

                    <th>ID</th>
                    <th>Empresa</th>
                    <th>Nome</th>
                    <th>Pontuação</th>
                    <th>Ações</th>

                </tr>

            </thead>

            <tbody>

                {cafes.length === 0 ? (
                
                    <tr>
                    
                        <td
                            colSpan="5"
                            style={{ textAlign: "center" }}
                        >
                        
                            Nenhum café cadastrado.
                
                        </td>
                
                    </tr>
            
                ) : (
                
                    cafes.map((cafe) => (
                    
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