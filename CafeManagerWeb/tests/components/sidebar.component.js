import { expect } from '@playwright/test';

export class SidebarComponent{

    constructor(page) {
        this.page = page;
    }

    // Título da sidebar
    get tituloSidebar() {
        return this.page.getByRole('heading', { name: 'Cafe Manager' });
    }

    // Menus da sidebar (Navegação)
    get menuCafes() {
        return this.page.getByRole('link', { name: 'Cafés' });
    }

    get menuReceitas() {
        return this.page.getByRole('link', { name: 'Receitas' });
    }

    get menuCalculadora() {
        return this.page.getByRole('link', { name: 'Calculadora' });
    }

    // Login
    get botaoAbrirLogin() {
        return this.page.getByRole('button', { name: 'Entrar' });
    }

    get campoEmail() {
        return this.page.getByPlaceholder('E-mail');
    }

    get campoSenha() {
        return this.page.getByPlaceholder('Senha');
    }
    
    get botaoFazerLogin() {
        return this.page.getByRole('button', { name: /Entrar/ });
    }

    // Usuário logado

    get nomeUsuarioLogado() {
        return this.page.locator('.sidebar-user');
    }

    get botaoSair() {
        return this.page.getByRole('button', { name: 'Sair' });
    }

    // Ações da sidebar (Métodos)
    async irParaCafes() {
        await this.menuCafes.click();
    }

    async irParaReceitas() {
        await this.menuReceitas.click();
    }

    async irParaCalculadora() {
        await this.menuCalculadora.click();
    }

    async irParaLogin () {
        await this.botaoAbrirLogin.click();
    }

    async fazerLogin () {
        await this.botaoFazerLogin.click();
    }

    async fazerLogout () {
        await this.botaoSair.click();
    }

    // Validações
    async loginExibeTodosMenus() {
        await expect(this.menuCafes).toBeVisible();
        await expect(this.menuReceitas).toBeVisible();
        await expect(this.menuCalculadora).toBeVisible();
    }

}