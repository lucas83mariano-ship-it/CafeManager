import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth-context";
import { getRoleLabel } from "../utils/role-utils";
import { cadastrar } from "../services/auth-service";
import { atualizarUsuario as atualizarUsuarioApi, excluirUsuario, alterarSenha } from "../services/usuario-service";
import Mensagem from "../components/mensagem";
import Confirmacao from "../components/ui/confirmacao";

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
    const [mensagem, setMensagem] = useState(null);
    const [mostrarConfirmacao, setMostrarConfirmacao] = useState(false);

    const navigate = useNavigate();

    const {
        usuario,
        atualizarUsuario,
        login,
        isAuthenticated,
        logout,
    } = useAuth();

    useEffect(() => {

        if (isAuthenticated || mensagem) {
            return;
        }
    
        function tratarTecla(event) {
        
            if (event.key !== "Escape") {
                return;
            }
        
            event.preventDefault();
        
            if (modoCadastro) {
            
                setModoCadastro(false);
            
                setNome("");
                setEmail("");
                setSenha("");
                setConfirmarSenha("");
            
                return;
            
            }
        
            voltar();
        
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
    
    }, [
        isAuthenticated,
        mensagem,
        modoCadastro,
    ]);
    
    async function fazerLogin(e) {

        e.preventDefault();

        try {

            await login(email, senha);

            navigate("/");

        }

        catch (erro) {

            console.error(erro);

            setMensagem({
                texto:
                    erro.response?.data?.detail ||
                    erro.message ||
                    "Erro ao realizar login.",
                tipo: "erro",
            });

        }

    }

    async function fazerCadastro(e) {

        e.preventDefault();

        if (senha !== confirmarSenha) {

            setMensagem({
                texto: "As senhas não conferem.",
                tipo: "erro",
            });

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

                setMensagem({
                    texto: mensagens.join("\n"),
                    tipo: "erro",
                });

            } else {

                setMensagem({
                    texto:
                        detalhe ||
                        "Não foi possível realizar o cadastro.",
                    tipo: "erro",
                });

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

            setMensagem({
                texto:
                    "Sua conta foi criada com sucesso, porém não foi possível fazer o login automático. Faça o login manualmente.",
                tipo: "erro",
            });

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

        setMensagem(null);

        setNomeEdicao(usuario.nome);

        setEmailEdicao(usuario.email);

        setModoEdicao(true);

    }

    function abrirAlterarSenha() {

        setMensagem(null);

        setSenhaAtual("");

        setNovaSenha("");

        setConfirmarNovaSenha("");

        setModoAlterarSenha(true);

    }

    async function salvarAlteracaoSenha(e) {

        e.preventDefault();

        if (!senhaAtual.trim()) {

            setMensagem({
                texto: "Informe sua senha atual.",
                tipo: "erro",
            });

            return;

        }

        if (!novaSenha.trim()) {

            setMensagem({
                texto: "Informe a nova senha.",
                tipo: "erro",
            });

            return;

        }

        if (novaSenha !== confirmarNovaSenha) {

            setMensagem({
                texto: "A confirmação da nova senha não confere.",
                tipo: "erro",
            });

            return;

        }

        try {

            const resposta = await alterarSenha(

                senhaAtual,

                novaSenha,

            );

            setMensagem({
                texto:
                    resposta.mensagem ||
                    "Senha alterada com sucesso.",
                tipo: "sucesso",
            });

            setSenhaAtual("");

            setNovaSenha("");

            setConfirmarNovaSenha("");

            setModoAlterarSenha(false);

        }

        catch (erro) {

            setMensagem({
                texto:
                    erro.response?.data?.detail ||
                    "Não foi possível alterar sua senha.",
                tipo: "erro",
            });

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

        const emailValido =
            /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEdicao);

        if (!emailValido) {

            setMensagem({
                texto: "Informe um e-mail válido.",
                tipo: "erro",
            });

            return;

        }

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

            setMensagem({
                texto: "Dados atualizados com sucesso.",
                tipo: "sucesso",
            });

        }

        catch (erro) {

            setMensagem({
                texto:
                    erro.response?.data?.detail ||
                    erro.message ||
                    "Não foi possível atualizar seus dados.",
                tipo: "erro",
            });

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

        try {

            const resposta = await excluirUsuario();

            setMensagem({
                texto: resposta.mensagem,
                tipo: "sucesso",
            });

            setMostrarConfirmacao(false);

            logout();

            navigate("/");

        }

        catch (erro) {

            setMostrarConfirmacao(false);
            
            setMensagem({
                texto:
                    erro.response?.data?.detail ||
                    "Não foi possível excluir sua conta.",
                tipo: "erro",
            });

        }

    }

    return (

        <div>

            <h1>Perfil</h1>

            <Mensagem
                mensagem={mensagem?.texto}
                tipo={mensagem?.tipo}
                onClose={() => setMensagem(null)}
            />

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
                        onClick={() => {
                            setMensagem(null);
                            setModoCadastro(!modoCadastro);
                        }}
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

                        <form 
                            onSubmit={salvarDados}
                            noValidate
                        >

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

                    <button onClick={() => setMostrarConfirmacao(true)} 
                        style={{ marginRight: "10px" }}>

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

            {mostrarConfirmacao && (

                <Confirmacao

                    titulo="Confirmar exclusão da conta"

                    mensagem={
                        "Deseja realmente excluir sua conta?\n\n" +
                        "Todos os seus cafés e receitas também serão excluídos."
                    }

                    onConfirm={excluirConta}

                    onCancel={() => setMostrarConfirmacao(false)}

                />

            )}

        </div>

    );

}