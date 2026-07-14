import Card from "../components/ui/card";
import Loading from "../components/ui/loading";
import CafesTable from "../components/cafes-table";
import useCafes from "../hooks/use-cafes";
import { useNavigate } from "react-router-dom";
import Button from "../components/ui/button";
import "../styles/cafes.css";

function Cafes() {

    const {

        cafes,
        loading,
        erro,
        carregar,

    } = useCafes();

    const navigate = useNavigate();

    if (loading) {

        return <Loading />;

    }

    if (erro) {
        return (
            <Card>
                <p>{erro}</p>
            </Card>
            );
    }

    return (

        <>
    
            <div className="page-header">
        
                <h1>Cafés</h1>
        
                <Button
                    onClick={() => navigate("/cafes/cadastrar")}
                >
                
                    Novo Café
        
                </Button>
        
            </div>
        
            <p className="table-info">
                
                Total de cafés: {cafes.length}
                
            </p>
            
            <Card>
        
                <CafesTable 
                    
                    cafes={cafes}
                    
                    onDelete={carregar}

                />
        
            </Card>
        
        </>
    
    );

}

export default Cafes;