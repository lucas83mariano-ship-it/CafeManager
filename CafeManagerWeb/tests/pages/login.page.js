import { expect } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class LoginPage {

    constructor(page) {
        this.page = page;
        this.headerComponent = new HeaderComponent(page);
    }

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

    // Campos da página para Criar Conta

    // Botões para Criar Conta

    get botaoCriarConta() {
        return this.page.getByRole('button', { name: 'Criar Conta' });
    }

    // Botão Voltar
    get botaoVoltar() {
        return this.page.getByRole('button', { name: 'Voltar' });
    }

    // Ações da página (métodos)
    async fazerLogin() {
        await this.botaoEntrar.click();
    }

    async clicarVoltar() {
        await this.botaoVoltar.click();
    }

    async loginAdmin() {
        await this.campoEmail.fill('admin@admin.com');
        await this.campoSenha.fill('AdminUsu123*');
        await this.fazerLogin();
    }

    async fazerLogout() {
        await this.botaoSair.click();
    }

    async acaoCompletaLogout(){
        await this.headerComponent.irParaPerfil();
        await this.fazerLogout();
    }

}