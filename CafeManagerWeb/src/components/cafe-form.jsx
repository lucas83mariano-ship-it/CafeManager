import { useEffect, useState } from "react";
import "./cafe-form.css";
import Input from "./ui/input";
import Button from "./ui/button";

function CafeForm({

    onSubmit,
    onCancel,
    initialData = {},
    textoBotao = "Salvar",

}) {

    const [empresa, setEmpresa] = useState(
        initialData.empresa || ""
    );

    const [nomeCafe, setNomeCafe] = useState(
        initialData.nome_cafe || ""
    );

    useEffect(() => {

        setEmpresa(initialData.empresa || "");

        setNomeCafe(initialData.nome_cafe || "");

    }, [initialData]);

    function enviar(event) {

        event.preventDefault();

        onSubmit({

            empresa,
            nome_cafe: nomeCafe,

        });

    }

    return (

        <form onSubmit={enviar}>

            <Input
                label="Empresa"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
            />

            <Input
                label="Nome do Café"
                value={nomeCafe}
                onChange={(e) => setNomeCafe(e.target.value)}
            />

            <div className="form-actions">

                <Button
                    type="button"
                    variant="secondary"
                    onClick={onCancel}
                >
                
                    Cancelar

                </Button>

                <Button type="submit">

                    {textoBotao}

                </Button>

            </div>

        </form>

    );

}

export default CafeForm;