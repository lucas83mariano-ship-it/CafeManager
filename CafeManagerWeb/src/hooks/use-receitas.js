import { useEffect, useState } from "react";

import { listarReceitas } from "../services/receita-service";

function useReceitas() {

    const [receitas, setReceitas] = useState([]);

    const [loading, setLoading] = useState(true);

    const [erro, setErro] = useState(null);

    async function carregar() {

        try {

            const dados = await listarReceitas();

            setReceitas(dados);

        }

        catch (erro) {

            console.error(erro);

            setErro("Não foi possível carregar as receitas.");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        carregar();

    }, []);

    return {

        receitas,
        loading,
        erro,
        carregar,

    };

}

export default useReceitas;