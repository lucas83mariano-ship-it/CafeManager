import { expect, request } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class LoginPage {

    constructor(page,request) {
        this.page = page;
        this.request = request;
        this.headerComponent = new HeaderComponent(page);
        this.usuarioAdmin = {
           nome: 'Admin',
           email: 'admin@admin.com',
           senha: 'AdminUsu123*'
        };
        this.usuarioLucas = {
            nome: 'Lucas',
            email: 'lucas83mariano@gmail.com',
            senha: 'Admin1*'
        };
        this.usuarioMonica = {
            nome: 'Mônica',
            email: 'monicamendonca66@gmail.com',
            senha: 'Admin2*'
        };
        this.usuarioTestador = {
            nome: 'Testador',
            email: 'testante@testador.com',
            senha: 'teste123*'
        }
        this.listaUsuarios = [
            {
               nome: 'Admin',
               email: 'admin@admin.com',
               senha: 'AdminUsu123*'
            },
            {
                nome: 'Lucas',
                email: 'lucas83mariano@gmail.com',
                senha: 'Admin1*'
            },
            {
                nome: 'Mônica',
                email: 'monicamendonca66@gmail.com',
                senha: 'Admin2*'
            }
        ]
    }

    // Objetos

    // Títulos da página
    get tituloPerfil() {
        return this.page.getByRole('heading', { name: 'Perfil' });
    }

    get tituloEntrar() {
        return this.page.getByRole('heading', { name: 'Entrar' });
    }

    // Campos da página para login
    get campoEmail() {
        return this.page.getByPlaceholder('E-mail');
    }

    get campoSenha() {
        return this.page.getByPlaceholder('Senha');
    }
    
    // Botões para login / logout
    get botaoEntrar() {
        return this.page.getByRole('button', { name: /Entrar/ });
    }

    get botaoSair() {
        return this.page.getByRole('button', { name: 'Sair' });
    }
    
    // Ações da página (métodos)
    async clicarEntrar() {
        await this.botaoEntrar.click();
    }

    async clicarVoltar() {
        await this.botaoVoltar.click();
    }

    async login(meusUsuarios) {
        await this.campoEmail.fill(meusUsuarios.email);
        await this.campoSenha.fill(meusUsuarios.senha);
        await this.clicarEntrar();
    }
    
    async login2(meuUsuario) {
        const resultado = this.listaUsuarios.filter(usuario => usuario.email === meuUsuario)
        await this.campoEmail.fill(resultado[0].email);
        await this.campoSenha.fill(resultado[0].senha);
        await this.clicarEntrar();
    }

    async loginAdmin() {
        await this.campoEmail.fill(this.usuarioAdmin.email);
        await this.campoSenha.fill(this.usuarioAdmin.senha);
        await this.clicarEntrar();
    }

    async loginUmUsuario() {
        await this.campoEmail.fill(this.listaUsuarios[2].email);
        await this.campoSenha.fill(this.listaUsuarios[2].senha);
        await this.clicarEntrar();
    }

    async fazerLogout() {
        await this.botaoSair.click();
    }

    async acaoCompletaLogout(){
        await this.headerComponent.irParaPerfil();
        await this.fazerLogout();
    }

    // Faz login na API, realiza um get no endpoint '/cafes' e armazena a quantidade de cafés recebidos na resposta em json.
    async qtdeCafesAdmin(){
        const loginAdmin = await this.request.post('http://localhost:8000/login', {
            data: {
                email: 'admin@admin.com',
                senha: 'AdminUsu123*'
            }
        });
        const dadosLogin = await loginAdmin.json();
        const resposta = await this.request.get('http://localhost:8000/cafes', {
            headers: {Authorization: `Bearer ${dadosLogin.access_token}`}
        });
        const cafesApi= await resposta.json();
        console.log(cafesApi);
    }

    // Faz login na API, realiza um get no endpoint '/usuarios' e armazena a lista de IDs, recebidos na resposta em json, em um array de números.
    async apiAdminQtdeUsuarios() {
        const loginAdmin = await this.request.post('http://localhost:8000/login', {
            data: {
                email: 'admin@admin.com',
                senha: 'AdminUsu123*'
            }
        });
        const dadosLogin = await loginAdmin.json();
        const respostaToken = await this.request.get('http://localhost:8000/usuarios', {
            headers: {Authorization: `Bearer ${dadosLogin.access_token}`
            }
        });
        const respostaApi = await respostaToken.json();
        const idsApi = await respostaApi.map(item => item.id);
        /* const idsApi = await respostaApi.evaluateAll(
        list => list.map(element => element.textContent)); */
        return (idsApi);
    }
}