import { expect, request } from '@playwright/test';

export class UsuariosPage {

    constructor(page) {
        this.page = page;
    }

    get tituloUsuarios() {
        return this.page.getByRole('heading', {name: 'Usuários'});
    }

    get colunaID() {
        return this.page.locator('//div/table/tbody/tr/td[1]');
    }

}