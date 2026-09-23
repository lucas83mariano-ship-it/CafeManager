import { useEffect, useState } from "react";
import {
    listarUsuarios,
    atualizarUsuarioPorId,
    alterarSenhaPorId
} from "../services/usuario-service";

function Usuarios() {

    const [usuarios, setUsuarios] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [editando, setEditando] = useState(null);
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [salvando, setSalvando] = useState(false);
    const [alterandoSenha, setAlterandoSenha] = useState(false);
    const [novaSenha, setNovaSenha] = useState("");
    const [salvandoSenha, setSalvandoSenha] = useState(false);

    async function carregarUsuarios() {

        try {

            const dados = await listarUsuarios();

            setUsuarios(dados);

        }

        catch (erro) {

            alert(
                erro.response?.data?.detail ||
                "Não foi possível carregar os usuários."
            );

        }

        finally {

            setCarregando(false);

        }

    }

    useEffect(() => {

        carregarUsuarios();

    }, []);

    function iniciarEdicao(usuario) {

        setEditando(usuario);

        setNome(usuario.nome);

        setEmail(usuario.email);

        setAlterandoSenha(false);

        setNovaSenha("");

    }

    function cancelarEdicao() {

        setEditando(null);

        setNome("");

        setEmail("");

        setAlterandoSenha(false);

        setNovaSenha("");

    }

    async function salvarEdicao(event) {

        event.preventDefault();

        try {

            setSalvando(true);

            const usuarioAtualizado =
                await atualizarUsuarioPorId(
                    editando.id,
                    nome,
                    email
                );

            setUsuarios((usuariosAtuais) =>
                usuariosAtuais.map((usuario) =>
                    usuario.id === usuarioAtualizado.id
                        ? usuarioAtualizado
                        : usuario
                )
            );

            cancelarEdicao();

            alert("Usuário atualizado com sucesso.");

        }

        catch (erro) {

            alert(
                erro.response?.data?.detail ||
                "Não foi possível atualizar o usuário."
            );

        }

        finally {

            setSalvando(false);

        }

    }

    function iniciarAlteracaoSenha() {

        setAlterandoSenha(true);

        setNovaSenha("");

    }

    function cancelarAlteracaoSenha() {

        setAlterandoSenha(false);

        setNovaSenha("");

    }

    async function salvarNovaSenha(event) {

        event.preventDefault();

        try {

            setSalvandoSenha(true);

            await alterarSenhaPorId(
                editando.id,
                novaSenha
            );

            setAlterandoSenha(false);

            setNovaSenha("");

            alert("Senha alterada com sucesso.");

        }

        catch (erro) {

            alert(
                erro.response?.data?.detail ||
                "Não foi possível alterar a senha."
            );

        }

        finally {

            setSalvandoSenha(false);

        }

    }

    if (carregando) {

        return <p>Carregando usuários...</p>;

    }

    return (

        <div>

            <h1>Usuários</h1>

            <br />

            {editando && (

                <form onSubmit={salvarEdicao}>

                    <h2>Editar usuário</h2>

                    <br />

                    <div>

                        <label htmlFor="nome">
                            Nome
                        </label>

                        <br />

                        <input
                            id="nome"
                            type="text"
                            value={nome}
                            onChange={(event) =>
                                setNome(event.target.value)
                            }
                            required
                        />

                    </div>

                    <br />

                    <div>

                        <label htmlFor="email">
                            E-mail
                        </label>

                        <br />

                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                            required
                        />

                    </div>

                    <br />

                    <button
                        type="submit"
                        disabled={salvando}
                    >
                        {salvando
                            ? "Salvando..."
                            : "Salvar"}
                    </button>

                    {" "}

                    <button
                        type="button"
                        onClick={cancelarEdicao}
                        disabled={salvando}
                    >
                        Cancelar
                    </button>

                    <br />
                    <br />

                    <hr />

                        <h3>Senha</h3>
                                                
                        {!alterandoSenha ? (
                        
                            <button
                                type="button"
                                onClick={iniciarAlteracaoSenha}
                            >
                                Alterar senha
                            </button>
                        
                        ) : (
                        
                            <div>
                            
                                <label htmlFor="novaSenha">
                                    Nova senha
                                </label>
                        
                                <br />
                        
                                <input
                                    id="novaSenha"
                                    type="password"
                                    value={novaSenha}
                                    onChange={(event) =>
                                        setNovaSenha(event.target.value)
                                    }
                                    required
                                />
                        
                                <br />
                                <br />
                                
                                <button
                                    type="button"
                                    onClick={salvarNovaSenha}
                                    disabled={salvandoSenha}
                                >
                                    {salvandoSenha
                                        ? "Salvando..."
                                        : "Salvar nova senha"}
                                </button>
                                    
                                {" "}
                                    
                                <button
                                    type="button"
                                    onClick={cancelarAlteracaoSenha}
                                    disabled={salvandoSenha}
                                >
                                    Cancelar
                                </button>
                                    
                            </div>
                        
                        )}

                </form>

            )}

            {usuarios.length === 0 ? (

                <p>Nenhum usuário cadastrado.</p>

            ) : (

                <table>

                    <thead>

                        <tr>

                            <th>ID</th>
                            
                            <th>Nome</th>

                            <th>E-mail</th>

                            <th>Perfil</th>

                            <th>Ações</th>

                        </tr>

                    </thead>

                    <tbody>

                        {usuarios.map((usuario) => (

                            <tr key={usuario.id}>

                                <td>
                                    {usuario.id}
                                </td>
                                
                                <td>
                                    {usuario.nome}
                                </td>

                                <td>
                                    {usuario.email}
                                </td>

                                <td>
                                    {usuario.role === "admin"
                                        ? "Admin"
                                        : "Amante de café"}
                                </td>

                                <td>

                                    <button
                                        type="button"
                                        onClick={() =>
                                            iniciarEdicao(usuario)
                                        }
                                    >
                                        Editar
                                    </button>

                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            )}

        </div>

    );

}

export default Usuarios;