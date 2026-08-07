import { useState } from "react";
import { useAuth } from "../context/auth-context";

function LoginForm({ onSuccess }) {

    const [email, setEmail] = useState("");

    const [senha, setSenha] = useState("");

    const { login } = useAuth();

    async function fazerLogin(e) {

        e.preventDefault();

        try {

            await login(email, senha);

            if (onSuccess) {

                onSuccess();

            }

        }

        catch {

            alert("E-mail ou senha inválidos.");

        }

    }

    return (

        <form onSubmit={fazerLogin}>

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