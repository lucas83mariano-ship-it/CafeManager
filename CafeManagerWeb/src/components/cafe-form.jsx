import { useEffect, useState } from "react";
import "./cafe-form.css";
import Input from "./ui/input";
import Button from "./ui/button";

const dadosIniciaisVazios = {};

function CafeForm({

    onSubmit,
    onCancel,
    initialData = dadosIniciaisVazios,
    textoBotao = "Salvar",

}) {

    const [empresa, setEmpresa] = useState(
        initialData.empresa || ""
    );

    const [nomeCafe, setNomeCafe] = useState(
        initialData.nome_cafe || ""
    );

    const [pontuacao, setPontuacao] = useState(
        initialData.pontuacao ?? ""
    );

    const [fazenda, setFazenda] = useState(
        initialData.fazenda || ""
    );

    const [produtor, setProdutor] = useState(
        initialData.produtor || ""
    );

    const [altitude, setAltitude] = useState(
        initialData.altitude ?? ""
    );

    const [torra, setTorra] = useState(
        initialData.torra || ""
    );

    const [aroma, setAroma] = useState(
        initialData.aroma || ""
    );

    const [sabor, setSabor] = useState(
        initialData.sabor || ""
    );

    const [retrogosto, setRetrogosto] = useState(
        initialData.retrogosto || ""
    );

    const [tipoCafe, setTipoCafe] = useState(
        initialData.tipo_cafe || ""
    );

    const [processamento, setProcessamento] = useState(
        initialData.processamento || ""
    );

    const [origem, setOrigem] = useState(
        initialData.origem || ""
    );

    const [linkProduto, setLinkProduto] = useState(
        initialData.link_produto || ""
    );

    useEffect(() => {

        setEmpresa(initialData.empresa || "");

        setNomeCafe(initialData.nome_cafe || "");

        setPontuacao(initialData.pontuacao ?? "");

        setFazenda(initialData.fazenda || "");

        setProdutor(initialData.produtor || "");

        setAltitude(initialData.altitude ?? "");

        setTorra(initialData.torra || "");

        setAroma(initialData.aroma || "");

        setSabor(initialData.sabor || "");

        setRetrogosto(initialData.retrogosto || "");

        setTipoCafe(initialData.tipo_cafe || "");

        setProcessamento(initialData.processamento || "");

        setOrigem(initialData.origem || "");

        setLinkProduto(initialData.link_produto || "");

    }, [initialData]);

    function enviar(event) {

        event.preventDefault();

        onSubmit({

            empresa: empresa.trim(),

            nome_cafe: nomeCafe.trim(),

            pontuacao: pontuacao === "" ? null : Number(pontuacao),

            fazenda: fazenda.trim() || null,

            produtor: produtor.trim() || null,

            altitude: altitude === "" ? null : Number(altitude),

            torra: torra.trim() || null,

            aroma: aroma.trim() || null,

            sabor: sabor.trim() || null,

            retrogosto: retrogosto.trim() || null,

            tipo_cafe: tipoCafe.trim() || null,

            processamento: processamento.trim() || null,

            origem: origem.trim() || null,

            link_produto: linkProduto.trim() || null,

        });

    }

    return (

        <form onSubmit={enviar}>

            <Input
                label="Empresa *"
                id="empresa"
                value={empresa}
                onChange={(e) => setEmpresa(e.target.value)}
            />

            <Input
                label="Nome do Café *"
                id="nome_cafe"
                value={nomeCafe}
                onChange={(e) => setNomeCafe(e.target.value)}
            />

            <Input
                label="Pontuação"
                id="pontuacao"
                type="number"
                min="0"
                max="100"
                step="0.1"
                value={pontuacao}
                onChange={(e) => setPontuacao(e.target.value)}
            />

            <Input
                label="Fazenda"
                id="fazenda"
                value={fazenda}
                onChange={(e) => setFazenda(e.target.value)}
            />

            <Input
                label="Produtor"
                id="produtor"
                value={produtor}
                onChange={(e) => setProdutor(e.target.value)}
            />

            <Input
                label="Altitude"
                id="altitude"
                type="number"
                step="1"
                value={altitude}
                onChange={(e) => setAltitude(e.target.value)}
            />

            <Input
                label="Torra"
                id="torra"
                value={torra}
                onChange={(e) => setTorra(e.target.value)}
            />

            <Input
                label="Aroma"
                id="aroma"
                value={aroma}
                onChange={(e) => setAroma(e.target.value)}
            />

            <Input
                label="Sabor"
                id="sabor"
                value={sabor}
                onChange={(e) => setSabor(e.target.value)}
            />

            <Input
                label="Retrogosto"
                id="retrogosto"
                value={retrogosto}
                onChange={(e) => setRetrogosto(e.target.value)}
            />

            <Input
                label="Tipo de Café"
                id="tipo_cafe"
                value={tipoCafe}
                onChange={(e) => setTipoCafe(e.target.value)}
            />

            <Input
                label="Processamento"
                id="processamento"
                value={processamento}
                onChange={(e) => setProcessamento(e.target.value)}
            />

            <Input
                label="Origem"
                id="origem"
                value={origem}
                onChange={(e) => setOrigem(e.target.value)}
            />

            <Input
                label="Link do Produto"
                id="link_produto"
                type="url"
                value={linkProduto}
                onChange={(e) => setLinkProduto(e.target.value)}
            />

            <div className="form-actions">

                <Button
                    type="button"
                    onClick={onCancel}
                >
                    Cancelar
                </Button>

                <Button
                    type="submit"
                    disabled={
                        !empresa.trim() ||
                        !nomeCafe.trim()
                    }
                >
                    {textoBotao}
                </Button>

            </div>

        </form>

    );

}

export default CafeForm;