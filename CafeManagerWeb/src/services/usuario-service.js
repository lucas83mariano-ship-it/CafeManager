import api from "./api";

export async function atualizarUsuario(nome, email) {

    const response = await api.put("/usuarios/me", {
        nome,
        email,
    });

    return response.data;

}

export async function excluirUsuario() {

    const response = await api.delete("/usuarios/me");

    return response.data;

}

export async function alterarSenha(
    senhaAtual,
    novaSenha,
) {

    const response = await api.patch(
        "/usuarios/me/senha",
        {
            senha_atual: senhaAtual,
            nova_senha: novaSenha,
        }
    );

    return response.data;

}