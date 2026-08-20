import { expect } from '@playwright/test';

export class CalculadoraPage {

    constructor(page) {
        this.page = page;
    }

    
    // Título da página
    get titulo() {
        return this.page.getByRole('heading', { name: 'Calcule sua Receita' });
    }

    
    // Grupos
    get grupoAgua() {
        return this.page.locator('.input-group').filter({ has: this.page.getByLabel('Água (ml)') });
    }

    get grupoCafe() {
        return this.page.locator('.input-group').filter({ has: this.page.getByLabel('Café (g)') });
    }

    get grupoProporcao() {
        return this.page.locator('.input-group').filter({ has: this.page.getByLabel('Proporção') });
    }

    
    // Campos da página
    get campoAgua() {
        return this.grupoAgua.getByLabel('Água (ml)');
    }

    get campoCafe() {
        return this.grupoCafe.getByLabel('Café (g)');
    }

    get campoProporcao() {
        return this.grupoProporcao.getByLabel('Proporção');
    }

    
    // Botões
    get botaoCalcular() {
        return this.page.getByRole('button', { name: /Calcular/ });
    }

    get botaoReiniciar() {
        return this.page.getByRole('button', { name: 'Reiniciar' });
    }

    
    // Mensagens
    get mensagemAgua() {
        return this.grupoAgua.locator('.input-message');
    }

    get mensagemCafe() {
        return this.grupoCafe.locator('.input-message');
    }

    get mensagemProporcao() {
        return this.grupoProporcao.locator('.input-message');
    }


    // Destaques
    get destaqueAgua() {
        return this.grupoAgua.locator('.calc-input.input-destaque');
    }

    get destaqueCafe() {
        return this.grupoCafe.locator('.calc-input.input-destaque');
    }

    get destaqueProporcao() {
        return this.grupoProporcao.locator('.calc-input.input-destaque');
    }

    // Erros (Destaques e Mensagens)
    get destaqueErroAgua() {
        return this.grupoAgua.locator('.calc-input.input-erro');
    }

    get destaqueErroCafe() {
        return this.grupoCafe.locator('.calc-input.input-erro');
    }

    get destaqueErroProporcao() {
        return this.grupoProporcao.locator('.calc-input.input-erro');
    }
    
    get mensagemErroAgua() {
        return this.grupoAgua.locator('.input-error');
    }

    get mensagemErroCafe() {
        return this.grupoCafe.locator('.input-error');
    }

    get mensagemErroProporcao() {
        return this.grupoProporcao.locator('.input-error');
    }

    // Validações
    async calculadoraInicial() {
        await expect(this.titulo).toBeVisible();
        await expect(this.campoAgua).toBeVisible();
        await expect(this.campoAgua).toBeEmpty();
        await expect(this.campoCafe).toBeVisible();
        await expect(this.campoCafe).toBeEmpty();
        await expect(this.campoProporcao).toBeVisible();
        await expect(this.campoProporcao).toBeEmpty();
        await expect(this.botaoReiniciar).toBeVisible();
        await expect(this.botaoCalcular).toBeDisabled();
    }

}

