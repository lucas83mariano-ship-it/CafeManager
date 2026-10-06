import { useState } from "react";
import { useAuth } from "../context/auth-context";
import Mensagem from "../components/mensagem";

function LoginForm({ onSuccess }) {

    const [email, setEmail] = useState("");

    const [senha, setSenha] = useState("");

    const { login } = useAuth();

    const [mensagem, setMensagem] = useState("");

    async function fazerLogin(e) {

        e.preventDefault();

        try {

            await login(email, senha);

            if (onSuccess) {

                onSuccess();

            }

        }

        catch {

            setMensagem({
                texto: "E-mail ou senha inválidos.",
                tipo: "erro",
            });

        }

    }

    return (

        <form onSubmit={fazerLogin}>

            <Mensagem mensagem={mensagem} />
            
            <input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />

            <br />

            <input
                type="password"
                placeholder="Senha"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
            />

            <br />

            <button type="submit">
                Entrar
            </button>

        </form>

    );

}

export default LoginForm;