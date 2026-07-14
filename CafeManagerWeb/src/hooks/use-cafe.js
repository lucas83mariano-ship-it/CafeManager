import { useEffect, useState } from "react";

import { buscarCafe } from "../services/cafe-service";

function useCafe(id) {

    const [cafe, setCafe] = useState(null);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    async function carregar() {

        try {

            const dados = await buscarCafe(id);

            setCafe(dados);

        }

        catch (erro) {

            console.error(erro);

            setErro("Não foi possível carregar o café.");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        carregar();

    }, [id]);

    return {

        cafe,
        loading,
        erro,
        carregar,

    };

}

export default useCafe;