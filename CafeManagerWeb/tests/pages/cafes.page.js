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

}