import { expect } from '@playwright/test';

export class HeaderComponent{

    constructor(page) {
        this.page = page;
    }

    // Título do Header
    get tituloHeader() {
        return this.page.locator('div[class="header-title"]', { hasText: 'Sistema de gerenciamento de cafés'});
    }

    // Perfil do usuário
    get linkPerfil() {
        return this.page.locator('a[href="/perfil"]');
    }

    // Ações do Header (Métodos)
    async irParaPerfil() {
        await this.linkPerfil.click();
    }

}