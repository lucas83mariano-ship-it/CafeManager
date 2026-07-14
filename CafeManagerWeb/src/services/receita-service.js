import api from "./api";

export async function listarReceitas() {

    const resposta = await api.get("/receitas");

    return resposta.data;

}

export async function buscarReceita(id) {

    const resposta = await api.get(`/receitas/${id}`);

    return resposta.data;

}

export async function cadastrarReceita(receita) {

    const resposta = await api.post("/receitas", receita);

    return resposta.data;

}

export async function atualizarReceita(id, receita) {

    const resposta = await api.put(`/receitas/${id}`, receita);

    return resposta.data;

}

export async function deletarReceita(id) {

    await api.delete(`/receitas/${id}`);

}