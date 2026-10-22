import { expect } from '@playwright/test';

export class CafePage{

    constructor(page) {
        this.page = page;
    }

    // Título da página
    get tituloCafes() {
        return this.page.getByRole('heading', { name: 'Cafés' });
    }

    get totalCafes() {
        return this.page.locator('.table-info');
    }

    // Tabela
    get tabelaCafes() {
        return this.page.locator('table');
    }

    get headTabela() {
        return this.tabelaCafes.locator('thead');
    }

    get bodyTabela() {
        return this.tabelaCafes.locator('tbody');
    }

    // Botões

    // Ações
    /*async headTabela
        await expect(cafePage.tabelaCafes).toContainText('Autor');
        console.log(
            await cafePage.tabelaCafes.evaluate(el => el.tagName)
        );*/
}