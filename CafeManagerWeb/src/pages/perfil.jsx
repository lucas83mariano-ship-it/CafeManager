import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { getRoleLabel } from "../utils/role-utils";
import { cadastrar } from "../services/auth-service";
import { atualizarUsuario as atualizarUsuarioApi, excluirUsuario, alterarSenha } from "../services/usuario-service";

export default function Perfil() {

    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
    const [modoCadastro, setModoCadastro] = useState(false);
    const [nome, setNome] = useState("");
    const [confirmarSenha, setConfirmarSenha] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [modoEdicao, setModoEdicao] = useState(false);
    const [modoAlterarSenha, setModoAlterarSenha] = useState(false);
    const [senhaAtual, setSenhaAtual] = useState("");
    const [novaSenha, setNovaSenha] = useState("");
    const [confirmarNovaSenha, setConfirmarNovaSenha] = useState("");
    const [nomeEdicao, setNomeEdicao] = useState("");
    const [emailEdicao, setEmailEdicao] = useState("");

    const navigate = useNavigate();

    const {
        usuario,
        atualizarUsuario,
        login,
        isAuthenticated,
        logout,
    } = useAuth();

    async function fazerLogin(e) {

        e.preventDefault();

        try {

            await login(email, senha);

            navigate("/");

        }

        catch (erro) {

            console.error(erro);
                
            alert(
                erro.response?.data?.detail ||
                erro.message ||
                "Erro ao realizar login."
            );
        
        }

    }

    async function fazerCadastro(e) {

        e.preventDefault();

        if (senha !== confirmarSenha) {

            alert("As senhas não conferem.");

            return;

        }

        setCarregando(true);

        try {
        
            await cadastrar(
                nome,
                email,
                senha,
            );
        
        }
        catch (erro) {

            const detalhe = erro.response?.data?.detail;
                
            if (Array.isArray(detalhe)) {
            
                const mensagens = detalhe.map((item) => {
                
                    if (item.loc?.includes("nome")) {
                    
                        return "Informe o nome de usuário.";
                    
                    }
                
                    if (item.loc?.includes("email")) {
                    
                        if (
                            item.type === "value_error" ||
                            item.type === "string_pattern_mismatch" ||
                            item.msg?.toLowerCase().includes("valid email") ||
                            item.msg?.toLowerCase().includes("email")
                        ) {
                        
                            return "Informe um e-mail válido.";
                        
                        }
                    
                        return "Informe o e-mail.";
                    
                    }
                
                    if (item.loc?.includes("senha")) {
                    
                        return "Informe a senha.";
                    
                    }
                
                    return item.msg || "Dados inválidos.";
                
                });
            
                alert(mensagens.join("\n"));
            
            } else {
            
                alert(
                    detalhe ||
                    "Não foi possível realizar o cadastro."
                );
            
            }
        
            setCarregando(false);
        
            return;
        
        }

        try {
        
            await login(
                email,
                senha,
            );
        
        }
        catch (erro) {
        
            alert(
                "Sua conta foi criada com sucesso, porém não foi possível fazer o login automático. Faça o login manualmente."
            );
        
            setCarregando(false);
        
            setModoCadastro(false);
        
            setSenha("");
        
            setConfirmarSenha("");
        
            return;
        
        }

        setModoCadastro(false);

        setNome("");

        setEmail("");

        setSenha("");

        setConfirmarSenha("");

        setCarregando(false);

        navigate("/cafes");

    }

    function alterarDados() {

        setNomeEdicao(usuario.nome);

        setEmailEdicao(usuario.email);

        setModoEdicao(true);

    }

    function abrirAlterarSenha() {

        setSenhaAtual("");

        setNovaSenha("");

        setConfirmarNovaSenha("");

        setModoAlterarSenha(true);

    }

    async function salvarAlteracaoSenha(e) {

        e.preventDefault();
        
        if (!senhaAtual.trim()) {
        
            alert("Informe sua senha atual.");
        
            return;
        
        }
    
        if (!novaSenha.trim()) {
        
            alert("Informe a nova senha.");
        
            return;
        
        }
    
        if (novaSenha !== confirmarNovaSenha) {
        
            alert("A confirmação da nova senha não confere.");
        
            return;
        
        }
    
        try {
        
            const resposta = await alterarSenha(
            
                senhaAtual,
            
                novaSenha,
            
            );
        
            alert(
            
                resposta.mensagem ||
            
                "Senha alterada com sucesso."
            
            );
        
            setSenhaAtual("");
        
            setNovaSenha("");
        
            setConfirmarNovaSenha("");
        
            setModoAlterarSenha(false);
        
        }
    
        catch (erro) {
        
            alert(
            
                erro.response?.data?.detail ||
            
                "Não foi possível alterar sua senha."
            
            );
        
        }
    
    }

    function cancelarAlterarSenha() {

        setSenhaAtual("");

        setNovaSenha("");

        setConfirmarNovaSenha("");

        setModoAlterarSenha(false);

    }

    async function salvarDados(e) {

        e.preventDefault();
        
        try {
        
            const usuarioAtualizado =
                await atualizarUsuarioApi(
                    nomeEdicao,
                    emailEdicao,
                );
            
            atualizarUsuario(
                usuarioAtualizado
            );
        
            setModoEdicao(false);
        
            alert("Dados atualizados com sucesso.");
        
        }
    
        catch (erro) {
        
            alert(
                erro.response?.data?.detail ||
                "Não foi possível atualizar seus dados."
            );
        
        }
    
    }

    function sair() {

        logout();

        navigate("/");

    }

    function voltar() {

        navigate("/");
    }

    function cancelarEdicao() {

        setNomeEdicao(usuario.nome);

        setEmailEdicao(usuario.email);

        setModoEdicao(false);

    }

    async function excluirConta() {

        const confirmar = window.confirm(

            "Deseja realmente excluir sua conta?\n\n" +
            "Todos os seus cafés e receitas também serão excluídos."

        );

        if (!confirmar) {

            return;

        }

        try {

            const resposta = await excluirUsuario();

            alert(resposta.mensagem);

            logout();

            navigate("/");

        }

        catch (erro) {

            alert(

                erro.response?.data?.detail ||

                "Não foi possível excluir sua conta."

            );

        }

    }

    return (

        <div>

            <h1>Perfil</h1>

            {!isAuthenticated ? (

                <>

                    <br /><hr /><br />

                    <h2>

                        {modoCadastro
                            ? "Criar conta"
                            : "Entrar"}

                    </h2>

                    <br />

                    <form
                        onSubmit={
                            modoCadastro
                                ? fazerCadastro
                                : fazerLogin
                        }
                        noValidate
                    >

                        {modoCadastro && (

                            <>

                                <input
                                    type="text"
                                    placeholder="Nome"
                                    value={nome}
                                    onChange={(e) => setNome(e.target.value)}
                                />

                                <br /><br />

                            </>

                        )}

                        <input
                            type="email"
                            placeholder="E-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />

                        <br /><br />

                        <input
                            type="password"
                            placeholder="Senha"
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                        />

                        {modoCadastro && (

                            <>

                                <br /><br />

                                <input
                                    type="password"
                                    placeholder="Confirmar senha"
                                    value={confirmarSenha}
                                    onChange={(e) =>
                                        setConfirmarSenha(e.target.value)
                                    }
                                />

                            </>

                        )}

                        <br /><br />

                        <button
                            type="submit"
                            disabled={carregando}
                        >

                            {carregando
                                ? (
                                    modoCadastro
                                        ? "Criando conta..."
                                        : "Entrando..."
                                )
                                : (
                                    modoCadastro
                                        ? "Criar conta"
                                        : "Entrar"
                                )}

                        </button>

                        <br /><br /><hr />

                    </form>

                    <br />

                    <button
                        type="button"
                        onClick={() =>
                            setModoCadastro(!modoCadastro)
                        }
                    >

                        {modoCadastro
                            ? "Já tenho uma conta"
                            : "Criar conta"}

                    </button>

                    <button onClick={voltar} style={{ marginLeft: "10px" }}>

                        Voltar

                    </button>

                </>

            ) : (

                <>

                    <hr /><br />

                    <h2>Minha Conta</h2>

                    <br />

                    {modoEdicao ? (

                        <form onSubmit={salvarDados}>
                        
                            <label>
                                        
                                Nome
                                        
                                <br />
                                        
                                <input
                                    type="text"
                                    value={nomeEdicao}
                                    onChange={(e) =>
                                        setNomeEdicao(e.target.value)
                                    }
                                />
                    
                            </label>
                                
                            <br /><br />
                                
                            <label>
                                
                                E-mail
                                
                                <br />
                                
                                <input
                                    type="email"
                                    value={emailEdicao}
                                    onChange={(e) =>
                                        setEmailEdicao(e.target.value)
                                    }
                                />
                    
                            </label>
                                
                            <br /><br />
                                
                            <button
                                type="submit"
                                style={{ marginRight: "10px" }}
                            >
                            
                                Salvar
                                
                            </button>
                                
                            <button
                                type="button"
                                onClick={cancelarEdicao}
                            >
                            
                                Cancelar
                                
                            </button>
                                
                        </form>
                    
                    ) : modoAlterarSenha ? (
                    
                        <form onSubmit={salvarAlteracaoSenha}>
                        
                            <label>
                    
                                Senha atual
                    
                                <br />
                    
                                <input
                                    type="password"
                                    value={senhaAtual}
                                    onChange={(e) =>
                                        setSenhaAtual(e.target.value)
                                    }
                                />
                    
                            </label>
                                
                            <br /><br />
                                
                            <label>
                                
                                Nova senha
                                
                                <br />
                                
                                <input
                                    type="password"
                                    value={novaSenha}
                                    onChange={(e) =>
                                        setNovaSenha(e.target.value)
                                    }
                                />
                    
                            </label>
                                
                            <br /><br />
                                
                            <label>
                                
                                Confirmar nova senha
                                
                                <br />
                                
                                <input
                                    type="password"
                                    value={confirmarNovaSenha}
                                    onChange={(e) =>
                                        setConfirmarNovaSenha(e.target.value)
                                    }
                                />
                    
                            </label>
                                
                            <br /><br />
                                
                            <button
                                type="submit"
                                style={{ marginRight: "10px" }}
                            >
                            
                                Alterar senha
                                
                            </button>
                                
                            <button
                                type="button"
                                onClick={cancelarAlterarSenha}
                            >
                            
                                Cancelar
                                
                            </button>
                                
                        </form>
                    
                    ) : (
                    
                        <>
                    
                            <p>
                    
                                <strong>Nome:</strong> {usuario?.nome}
                    
                            </p>
                    
                            <p>
                    
                                <strong>Email:</strong> {usuario?.email}
                    
                            </p>
                    
                            <p>
                    
                                <strong>Perfil:</strong> {getRoleLabel(usuario?.role)}
                    
                            </p>
                    
                        </>
                    
                    )}

                    <br /><hr /><br />

                    <button onClick={alterarDados} disabled={modoEdicao} style={{ marginRight: "10px" }}>

                        Alterar dados

                    </button>

                    <button onClick={abrirAlterarSenha} disabled={modoEdicao || modoAlterarSenha} style={{ marginRight: "10px" }}>

                        Alterar senha

                    </button>

                    <button onClick={excluirConta} style={{ marginRight: "10px" }}>

                        Excluir conta

                    </button>

                    <button onClick={sair}>

                        Sair

                    </button>

                    <br /><br /><hr /><br />

                    <button onClick={voltar}>
                        Voltar
                    </button>

                </>

            )}

        </div>

    );

}