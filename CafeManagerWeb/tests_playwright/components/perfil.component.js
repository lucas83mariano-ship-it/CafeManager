import { expect, request } from '@playwright/test';

export class PerfilComponent {
    constructor(page) {
        this.page = page;
    }

    get botaoCriarConta() {
        return this.page.getByRole('button', {name: 'Criar conta'});
    }
    
    get botaoVoltar() {
        return this.page.getByRole('button', { name: 'Voltar' });
    }

    async clicarCriarConta() {
        await this.botaoCriarConta.click();
    }

    async clicarVoltar() {
        await this.botaoVoltar.click();
    }
}