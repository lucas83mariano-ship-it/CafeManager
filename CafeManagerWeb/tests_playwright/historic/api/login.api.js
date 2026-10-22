import { endpointsApi } from "./endpoints.api";
import { listaUsuarios } from "../fixture/usuarios";
import { expect } from '@playwright/test';

export class ApiLogin {

    constructor(request) {
        this.request = request;
    }

    async fazerLoginToken(meuUsuario) {
        const resultadoUsuario = listaUsuarios.filter(listaUsuario => listaUsuario.nome === meuUsuario);
        const loginApi = await this.request.post(`${endpointsApi.BaseUrl}${endpointsApi.Login}`, {
            data: {
                email: resultadoUsuario[0].email,
                senha: resultadoUsuario[0].senha
            }
        })
        expect(loginApi.status()).toBe(200);
        const tokenJson = await loginApi.json();
        const token = tokenJson.access_token;
        return(token)
    };
}
