import { useEffect, useState } from "react";

import { listarCafes } from "../services/cafe-service";

function useCafes() {

    const [cafes, setCafes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [erro, setErro] = useState(null);

    async function carregar() {

        try {

            setLoading(true);

            const dados = await listarCafes();

            setCafes(dados);

            setErro(null);

        }

        catch (erro) {

            console.error(erro);

            setErro("Não foi possível carregar os cafés.");

        }

        finally {

            setLoading(false);

        }

    }

    useEffect(() => {

        carregar();

    }, []);

    return {

        cafes,
        loading,
        erro,
        carregar,

    };

}

export default useCafes;