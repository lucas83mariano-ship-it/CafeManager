import { endpointsApi } from "./endpoints.api";
import { listaUsuarios } from "../fixture/usuarios";
import { expect } from '@playwright/test';

export class ApiDelete {

    constructor(request) {
        this.request = request
    }

    async adminDeletaUsuario(meuUsuario, meuToken) {
        const resultadoUsuario = listaUsuarios.filter(listaUsuario => listaUsuario.nome === meuUsuario)
        return await this.executarDelete(`${endpointsApi.BaseUrl}${endpointsApi.UsuarioEmail}` + resultadoUsuario[0].email, meuToken)
    }

    async deletarUsuarioMe(meuUsuario, meuToken) {
        const resultadoUsuario = listaUsuarios.filter(listaUsuario => listaUsuario.nome === meuUsuario)
        return await this.executarDelete(`${endpointsApi.BaseUrl}${endpointsApi.UsuarioMe}` + resultadoUsuario[0].email, meuToken)
    }

    async executarDelete(endpoint, meuToken) {
        const deleteUsu = await this.request.delete(endpoint, {
            headers: {
                'Authorization': `Bearer ${meuToken}`
            }
        })
        const deleteUsuStatus = deleteUsu.status()
        const deleteUsuResposta = await deleteUsu.json()
        if (deleteUsuStatus === 200) {
            expect(deleteUsuResposta).toMatchObject({
                mensagem: 'Usuário removido com sucesso. Todos os cafés e receitas cadastrados também foram excluídos.'
            })
        }
        else if (deleteUsuStatus === 404) {
            expect(deleteUsuResposta).toMatchObject({
                detail: 'Usuário não encontrado.'
            })
        } else {
            throw new Error (deleteUsuStatus + ' Erro inesperado.')
        }
    }
}