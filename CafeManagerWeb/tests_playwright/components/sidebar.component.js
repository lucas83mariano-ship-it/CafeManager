import { expect } from '@playwright/test';

export class SidebarComponent{

    constructor(page) {
        this.page = page;
    }

    // Título da sidebar
    get tituloSidebar() {
        return this.page.getByRole('heading', { name: 'Cafe Manager' });
    }

    // Sidebar (Navegação)
    get sidebarMenuCafes() {
        return this.page.locator ('.sidebar').filter({ has: this.page.getByRole('link', { name: 'Cafés' })});
    }

    get sidebarMenuReceitas() {
        return this.page.locator ('.sidebar').filter({ has: this.page.getByRole('link', { name: 'Receitas' })});
    }

    get sidebarMenuCalculadora() {
        return this.page.locator ('.sidebar').filter({ has: this.page.getByRole('link', { name: 'Calculadora' })});
    }

    get sidebarMenuUsuarios() {
        return this.page.locator ('.sidebar').filter({ has: this.page.getByRole('link', { name: 'Usuários' })});
    }

    // Menus
    get menuCafes() {
        return this.sidebarMenuCafes.getByRole('link', { name: 'Cafés' });
    }

    get menuReceitas() {
        return this.sidebarMenuReceitas.getByRole('link', { name: 'Receitas' });
    }

    get menuCalculadora() {
        return this.sidebarMenuCalculadora.getByRole('link', { name: 'Calculadora' });
    }

    get menuUsuarios() {
        return this.sidebarMenuUsuarios.getByRole('link', { name: 'Usuários' });
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

    async irParaUsuarios () {
        await this.menuUsuarios.click();
    }

    // Validações
    async sidebarInicial() {
        await expect(this.menuCalculadora).toBeVisible();
        await expect(this.menuCafes).not.toBeVisible();
        await expect(this.menuReceitas).not.toBeVisible();
        await expect(this.menuUsuarios).not.toBeVisible();
    }
    
    async loginExibeTodosMenus() {
        await expect(this.menuCafes).toBeVisible();
        await expect(this.menuReceitas).toBeVisible();
        await expect(this.menuCalculadora).toBeVisible();
        await expect(this.menuUsuarios).toBeVisible();
    }

    async loginMenusUser() {
        await expect(this.menuCafes).toBeVisible();
        await expect(this.menuReceitas).toBeVisible();
        await expect(this.menuCalculadora).toBeVisible();
        await expect(this.menuUsuarios).not.toBeVisible();
    }

}