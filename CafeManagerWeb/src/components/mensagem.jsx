import { useEffect, useRef } from "react";
import Card from "./ui/card";
import Button from "./ui/button";

import "../styles/mensagem.css";

export default function Mensagem({
    mensagem,
    tipo = "erro",
    onClose,
}) {

    const botaoRef = useRef(null);

    useEffect(() => {

        if (!mensagem) {
            return;
        }

        botaoRef.current?.focus();

        function tratarTecla(event) {

            if (event.key === "Escape") {

                event.preventDefault();
                event.stopPropagation();

                onClose();

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

    }, [mensagem, onClose]);

    if (!mensagem) {
        return null;
    }

    const sucesso = tipo === "sucesso";

    return (

        <div
            className="mensagem-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="mensagem-titulo"
        >

            <Card>

                <div className="mensagem">

                    <h2 id="mensagem-titulo">

                        {sucesso
                            ? "Sucesso"
                            : "Erro"}

                    </h2>

                    <p>

                        <span aria-hidden="true">
                            {sucesso ? "✓ " : "⚠ "}
                        </span>

                        {mensagem}

                    </p>

                    <div className="mensagem-acoes">

                        <Button
                            ref={botaoRef}
                            onClick={onClose}
                        >
                            OK
                        </Button>

                    </div>

                </div>

            </Card>

        </div>

    );

}