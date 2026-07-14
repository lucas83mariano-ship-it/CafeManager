import { useEffect, useState, useRef } from "react";

import Card from "../components/ui/card";
import Input from "../components/ui/input";
import Button from "../components/ui/button";

import "../styles/calculadora.css";

function Calculadora() {

    const [agua, setAgua] = useState("");

    const [cafe, setCafe] = useState("");

    const [proporcao, setProporcao] = useState("");

    const [erros, setErros] = useState({

        agua: "",
        cafe: "",
        proporcao: "",

    });

    const debounceRef = useRef(null);

    const [resultadoCalculado, setResultadoCalculado] = useState(false);

    useEffect(() => {

        clearTimeout(debounceRef.current);

        debounceRef.current = setTimeout(() => {

            validarCampos();

        }, 300);

        return () => clearTimeout(debounceRef.current);

    }, [agua, cafe, proporcao]);

    const aguaValida = campoValido(agua);

    const cafeValido = campoValido(cafe);

    const proporcaoValida = campoValido(proporcao);

    const camposVazios = [

        !agua ? "agua" : null,

        !cafe ? "cafe" : null,

        !proporcao ? "proporcao" : null,

    ].filter(Boolean);

    const campoCalculado =

        camposVazios.length === 1 &&

        (
            agua === "" || aguaValida
        ) &&

        (
            cafe === "" || cafeValido
        ) &&

        (
            proporcao === "" || proporcaoValida
        )

            ? camposVazios[0]

            : null;

    const textoBotao = (() => {

        switch (campoCalculado) {

            case "agua":
                return "Calcular Água (ml)";

            case "cafe":
                return "Calcular Café (g)";

            case "proporcao":
                return "Calcular Proporção";

            default:
                return "Calcular";

        }

    })();

    const podeCalcular = 
    
        campoCalculado !== null &&

        !erros.agua &&
        !erros.cafe &&
        !erros.proporcao;

    const botaoCalcularHabilitado = podeCalcular;

    function validarCampos() {

        let possuiErro = false;

        const novosErros = {

            agua: "",
            cafe: "",
            proporcao: "",

        };

        const aguaValor = converterNumero(agua);
        const cafeValor = converterNumero(cafe);
        const proporcaoValor = converterNumero(proporcao);

        if (agua !== "") {

            if (isNaN(aguaValor)) {

                novosErros.agua = "Informe um número válido.";

                possuiErro = true;

            }

            else if (aguaValor <= 0) {

                novosErros.agua = "Informe um valor maior que zero.";

                possuiErro = true;

            }

        }

        if (cafe !== "") {

            if (isNaN(cafeValor)) {

                novosErros.cafe = "Informe um número válido.";

                possuiErro = true;

            }

            else if (cafeValor <= 0) {

                novosErros.cafe = "Informe um valor maior que zero.";

                possuiErro = true;

            }

        }

        if (proporcao !== "") {

            if (isNaN(proporcaoValor)) {

                novosErros.proporcao = "Informe um número válido.";

                possuiErro = true;

            }

            else if (proporcaoValor <= 0) {

                novosErros.proporcao = "Informe um valor maior que zero.";

                possuiErro = true;

            }

        }

        setErros(novosErros);

        return !possuiErro;

    }

    function calcularResultado() {

        const aguaValor = converterNumero(agua);

        const cafeValor = converterNumero(cafe);

        const proporcaoValor = converterNumero(proporcao);

        if (campoCalculado === "agua") {

            const resultado = cafeValor * proporcaoValor;

            setAgua(Math.round(resultado).toString());

            setResultadoCalculado("agua");

        }

        else if (campoCalculado === "cafe") {

            const resultado = aguaValor / proporcaoValor;

            setCafe(resultado.toFixed(1));

            setResultadoCalculado("cafe");

        }

        else if (campoCalculado === "proporcao") {

            const resultado = aguaValor / cafeValor;

            setProporcao(resultado.toFixed(1));

            setResultadoCalculado("proporcao");

        }

    }

    function converterNumero(valor) {

        if (!valor) {

            return NaN;

        }
        
        return Number(valor.replace(",", "."));

    }

    function campoValido(valor) {

        if (valor === "") {

            return false;

        }

        const numero = converterNumero(valor);

        return !isNaN(numero) && numero > 0;

    }
    
    function calcular(event) {

        event.preventDefault();

        if (!podeCalcular) {

            return;

        }

        calcularResultado();

    }

    function limparResultado(campo) {

        if (!resultadoCalculado) {

            return;

        }

        if (campo === resultadoCalculado) {

            return;

        }

        switch (resultadoCalculado) {

            case "agua":

                setAgua("");

                break;

            case "cafe":

                setCafe("");

                break;

            case "proporcao":

                setProporcao("");

                break;

        }

        setResultadoCalculado(null);

    }

    function alterarCampo(campo, valor) {

        if (campo === resultadoCalculado) {

            setResultadoCalculado(null);
        }

        limparResultado(campo);

        switch (campo) {

            case "agua":
                setAgua(valor);
                break;

            case "cafe":
                setCafe(valor);
                break;

            case "proporcao":
                setProporcao(valor);
                break;

        }

    }

    function reiniciarCalculadora() {

        setAgua("");
        setCafe("");
        setProporcao("");

        setResultadoCalculado(null);

        setErros({

            agua: "",
            cafe: "",
            proporcao: "",

        });

    }

    return (

        <>

            <h1>Calcule sua Receita</h1>

            {/*<p>

                Preencha 2 campos para realizar o cálculo do 3º.

            </p>*/}

            <div className="calculadora-layout">

                <Card className="calculadora-card">
                    
                    <form onSubmit={calcular}>
                        <Input
                            id="agua"
                            label="Água (ml)"
                            value={agua}
                            onChange={(e) => {alterarCampo("agua", e.target.value)}}
                            className="calc-input"
                            destaque={campoCalculado === "agua" && podeCalcular}
                            mensagem={
                                campoCalculado === "agua" && podeCalcular
                                    ? "Este valor será calculado automaticamente."
                                    : ""
                            }
                            erro={erros.agua}
                        />

                        <Input
                            id="cafe"
                            label="Café (g)"
                            value={cafe}
                            onChange={(e) => {alterarCampo("cafe", e.target.value)}}
                            className="calc-input"
                            destaque={campoCalculado === "cafe" && podeCalcular}
                            mensagem={
                                campoCalculado === "cafe" && podeCalcular
                                    ? "Este valor será calculado automaticamente."
                                    : ""
                            }
                            erro={erros.cafe}
                        />

                        <Input
                            id="proporcao"
                            label="Proporção"
                            value={proporcao}
                            onChange={(e) => {alterarCampo("proporcao", e.target.value)}}
                            className="calc-input"
                            destaque={campoCalculado === "proporcao" && podeCalcular}
                            mensagem={
                                campoCalculado === "proporcao" && podeCalcular
                                    ? "Este valor será calculado automaticamente."
                                    : ""
                            }
                            erro={erros.proporcao}
                        />

                        <div className="calculadora-botoes">

                            <Button
                                type="button"
                                onClick={reiniciarCalculadora}
                            >

                                Reiniciar

                            </Button>

                            <Button
                                type="submit"
                                disabled={!botaoCalcularHabilitado}
                            >

                                {textoBotao}

                            </Button>

                        </div>
                
                    </form>
                
                </Card>
                
                <Card className="calculadora-info">
                
                    <h3>Dica</h3>
                
                    <p>* A calculadora realiza o cálculo de forma automática. Para isso, preencha pelo menos 2 campos com números maiores do que zero, e clique em Calcular.
                    
                    </p>
                
                </Card>
                
            </div>

        </>

    );

}

export default Calculadora;