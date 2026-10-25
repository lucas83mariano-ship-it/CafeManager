import { endpointsApi } from "./endpoints.api";
import { listaUsuarios } from "../fixture/dados/usuarios.data";
import { expect } from '@playwright/test';

export class ApiCadastra {

    constructor(request) {
        this.request = request
    }

    async cadastrarUsuario(meuUsuario) {
        const resultadoUsuario = listaUsuarios.filter(listaUsuario => listaUsuario.nome === meuUsuario)
        const cadastroUsu = await this.request.post(`${endpointsApi.BaseUrl}usuarios`, {
            data: {
                nome: resultadoUsuario[0].nome,
                email: resultadoUsuario[0].email,
                senha: resultadoUsuario[0].senha
            }
        })
        expect(cadastroUsu.ok()).toBeTruthy();
        expect(await cadastroUsu.json()).toMatchObject({
            nome: resultadoUsuario[0].nome,
            email: resultadoUsuario[0].email,
            role: 'user'
        })
    }
}