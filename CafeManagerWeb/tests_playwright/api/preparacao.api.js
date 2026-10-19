import { ApiLogin } from '../api/login.api';
import { ApiDelete } from '../api/delete.api';
import { ApiCadastra } from '../api/cadastro.api';

export class PreparaAmbiente {
    constructor(request) {
        this.request = request
        this.apiLogin = new ApiLogin(request);
        this.apiDelete = new ApiDelete(request);
        this.apiCadastra = new ApiCadastra(request);
    }

    async prepararUsuarioTeste() {
        const tokenApi = await this.apiLogin.fazerLoginToken('Admin');
        await this.apiDelete.adminDeletaUsuario('Testador', tokenApi);
        await this.apiCadastra.cadastrarUsuario('Testador');
    }

    async limparUsuarioTeste() {
        const tokenApi = await this.apiLogin.fazerLoginToken('Testador');
        await this.apiDelete.deletarUsuarioMe('Testador', tokenApi);
    }

}