import api from "./api";

export async function listarCafes() {

    const resposta = await api.get("/cafes");

    return resposta.data;

}

export async function buscarCafe(id) {

    const resposta = await api.get(`/cafes/${id}`);

    return resposta.data;

}

export async function cadastrarCafe(cafe) {

    const resposta = await api.post("/cafes", cafe);

    return resposta.data;

}

export async function atualizarCafe(id, cafe) {

    const resposta = await api.put(`/cafes/${id}`, cafe);

    return resposta.data;

}

export async function deletarCafe(id) {

    await api.delete(`/cafes/${id}`);

}

export const cafeService = {
    async createCafe(data) {
        try {
            const response = await fetch('/api/cafes', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            });

            if (!response.ok) {
                throw new Error('Erro ao criar café.');
            }

            return await response.json();
        } catch (erro) {
            console.error(erro);
            throw erro;
        }
    },

    // Outros métodos como update, delete poderão vir depois.
};
