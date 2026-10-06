import { useEffect, useRef } from "react";
import Card from "./card";
import Button from "./button";

import "../../styles/confirmacao.css";

function Confirmacao({
    titulo = "Confirmar ação",
    mensagem,
    onConfirm,
    onCancel,
}) {

    const botaoCancelarRef = useRef(null);

    useEffect(() => {

        botaoCancelarRef.current?.focus();

        function tratarTecla(event) {

            if (event.key === "Escape") {

                event.preventDefault();
                event.stopPropagation();

                onCancel();

            }

        }

        document.addEventListener(
            "keydown",
            tratarTecla
        );

        return () => {

            document.removeEventListener(
                "keydown",
                tratarTecla
            );

        };

    }, [onCancel]);

    return (

        <div className="confirmacao-overlay">

            <Card>

                <div className="confirmacao">

                    <h2>{titulo}</h2>

                    <p>{mensagem}</p>

                    <div className="confirmacao-acoes">

                        <Button
                            ref={botaoCancelarRef}
                            variant="secondary"
                            onClick={onCancel}
                        >
                            Cancelar
                        </Button>

                        <Button
                            onClick={onConfirm}
                        >
                            Confirmar
                        </Button>

                    </div>

                </div>

            </Card>

        </div>

    );

}

export default Confirmacao;