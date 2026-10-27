import { test, expect } from '@playwright/test';
import { CalculadoraPage } from './pages/calculadora.page';
import { SidebarComponent } from './components/sidebar.component';
import { cenariosCalculo } from './fixture/dados/calculadora.data';

test('Validar botão Calcular desabilitado quando preenche apenas um campo, ou todos', async ({ page }) => {
    // O botão Calcular deve permanecer com nome "Calcular" e desabilitado enquanto o usuário preencher apenas um campo, ou se o usuário preencher todos os 3 campos com valores válidos.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');

    for (const cenario of cenariosCalculo) {
        // Quando o cenário for 'todos', então os 3 campos serão preenchidos
        if (cenario.cenário === 'todos') {
            for (let posicao = 0; posicao < cenario.campos.length; posicao++) {
                const meuCampo = calculadoraPage[cenario.campos[posicao]]
                await  meuCampo.fill(cenario.valor[posicao]);
            }
        // Cada campo é preenchido individualmente durante o laço
        } else {
            await calculadoraPage[cenario.campos].fill(cenario.valor);
        }
        // O status do botão 'Calcular' é validado após cada preenchimento
        await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
        await expect(calculadoraPage.botaoCalcular).toBeDisabled();
        // Limpeza manual dos campos para dar seguimento ao laço
        await calculadoraPage.limparCampos();
    }
});

test('Validar o funcionamento do botão reiniciar', async ({ page }) => {
    // O clique no botão Reiniciar deve excluir qualquer valor existente em qualquer um dos campos da calculadora.
    // A refatoração envolveu uso de loop para percorrer os cenários de teste, já que envolvia preencher um campo por vez para validar a mesma regra de negócio.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);

    // Ação
    await page.goto('/');

    // Preenche um valor em cada campo e pressiona o botão reiniciar. Depois de fazer isso com cada campo, preenche todos os 3 e pressiona o botão reiniciar.
    for (const cenario of cenariosCalculo) {
        if (cenario.cenário === 'todos') {
            for (let posicao = 0; posicao < cenario.campos.length; posicao++) {
                await calculadoraPage[cenario.campos[posicao]].fill(cenario.valor[posicao])
            }
        } else {
            await calculadoraPage[cenario.campos].fill(cenario.valor)
        }
        await calculadoraPage.reiniciarCalculadora();
        await calculadoraPage.validarCalcEstadoInicial();
    }
});

test('Validar cálculo automático da Proporção', async ({ page }) => {
    // Sempre que o usuário preencher os campos Água(ml) e Café(g) com valores > 0, então o campo Proporção deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular Proporção'. O clique no botão Calcular deve realizar o cálculo e o campo Proporção deve exibir o resultado esperado.

    //Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.preencherValoresParaCalculo('campoAgua', 'campoCafe')
    // Validação
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    //Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await calculadoraPage.validarResultadoCalculo('campoProporcao', 15)
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});

test('Validar cálculo automático da Água_ml', async ({ page }) => {
    // Sempre que o usuário preencher os campos Café(g) e Proporção com valores > 0, então o campo Água(ml) deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular Água(ml)'. O clique no botão Calcular deve realizar o cálculo e o campo Água(ml) deve exibir o resultado esperado.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.preencherValoresParaCalculo('campoCafe', 'campoProporcao')
    // Validação
    await expect(calculadoraPage.mensagemAgua).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Água (ml)');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await calculadoraPage.validarResultadoCalculo('campoAgua',465)
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});

test('Validar cálculo automático do Café_g', async ({ page }) => {
    // Sempre que o usuário preencher os campos Água(ml) e Proporção com valores > 0, então o campo Café(g) deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular Café(g)'. O clique no botão Calcular deve realizar o cálculo e o campo Café(g) deve exibir o resultado esperado.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.preencherValoresParaCalculo('campoAgua', 'campoProporcao')
    // Validação
    await expect(calculadoraPage.mensagemCafe).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Café (g)');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await calculadoraPage.validarResultadoCalculo('campoCafe', 31);
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});

test('Validar a limpeza automática do resultado do cálculo', async ({ page }) => {
    // Validar que após realizar cálculo automático, se o usuário editar um dos 2 valores preenchidos anteriormente então o resultado deve ser apagado automaticamente para receber novo resultado.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('21');
    // Validação
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    // Ação
    await calculadoraPage.botaoCalcular.click();
    // Validação
    await expect(calculadoraPage.campoProporcao).toHaveValue('23.8');
    // Ação
    await calculadoraPage.campoCafe.fill('30');
    // Validação
    await expect(calculadoraPage.campoCafe).toHaveValue('30');
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await expect(calculadoraPage.campoProporcao).toHaveValue('16.7');
    // Ação
    await calculadoraPage.campoAgua.fill('600');
    // Validação
    await expect(calculadoraPage.campoCafe).toHaveValue('30');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await expect(calculadoraPage.campoProporcao).toHaveValue('20.0');
});

test('Validar destaque de erro e mensagem de erro para valor=0', async ({ page }) => {
    // Sempre que o usuário digitar valor=0 em algum campo, então os campos deverão receber destaque com contorno em vermelho, e deve ser exibido a mensagem 'Informe um valor maior que zero'.
    // O botão Calcular deve permanecer desabilitado.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();

    // Ação
    await calculadoraPage.campoAgua.fill('0');

    // Verificação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.validarCalcularDesabilitado();

    // Ação
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('0');

    // Verificação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um valor maior que zero.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.validarCalcularDesabilitado();

    // Ação
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('0');
    await calculadoraPage.campoProporcao.fill('0');

    // Verificação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um valor maior que zero.');
    await calculadoraPage.validarCalcularDesabilitado();
});

test('Validar destaque de erro e mensagem de erro para valor=0 e valor>0', async ({ page }) => {
    // Quando o usuário preencher um campo=0 e outro campo>0, então o botão Calcular deve permanecer com esse nome e desabilitado, além de não ser exibida a mensagem de cálculo automático no terceiro campo.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);

    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('1');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await expect(calculadoraPage.mensagemProporcao).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoAgua.fill('1');
    await calculadoraPage.campoProporcao.fill('0');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um valor maior que zero.');
    await expect(calculadoraPage.mensagemCafe).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoCafe.fill('0');
    await calculadoraPage.campoProporcao.fill('1');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um valor maior que zero.');
    await expect(calculadoraPage.mensagemAgua).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
})

test('Validar destaque de erro e mensagem de erro para valor=string', async ({ page }) => {
    // Sempre que o usuário digitar valor =0, então os campos deverão receber destaque com contorno em vermelho, e deve ser exibido a mensagem 'Informe um número válido.'.
    // O botão Calcular deve permanecer desabilitado.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('-');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um número válido.');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.campoAgua.fill('-');
    await calculadoraPage.campoCafe.fill('-');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um número válido.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.campoAgua.fill('-');
    await calculadoraPage.campoCafe.fill('-');
    await calculadoraPage.campoProporcao.fill('-');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um número válido.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um número válido.');
    await calculadoraPage.validarCalcularDesabilitado();
});

test('Validar destaque de erro e mensagem de erro para valor=string e valor>0', async ({ page }) => {
    // Caso o usuário preencha um campo<0 e outro campo>0, então o botão Calcular deve permanecer com esse nome e desabilitado, além de não ser exibida a mensagem de cálculo automático no terceiro campo.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('-');
    await calculadoraPage.campoCafe.fill('1');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemProporcao).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoAgua.fill('1');
    await calculadoraPage.campoProporcao.fill('-');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemCafe).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoCafe.fill('-');
    await calculadoraPage.campoProporcao.fill('1');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemAgua).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
})

test('Validar mensagem de erro correta para valor=0 e valor!=número', async ({ page }) => {
    // Caso o usuário preencha um valor=0 então deve ser exibida a mensagem 'Informe um valor maior que zero.', se preencher um valor!=número deve ser exibida a mensagem 'Informe um número válido.'

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('a');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemProporcao).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoAgua.fill('a');
    await calculadoraPage.campoProporcao.fill('0');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemCafe).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoProporcao.fill('a');
    await calculadoraPage.campoCafe.fill('0');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemAgua).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('a');
    await calculadoraPage.campoProporcao.fill('-');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um número válido.');
    await calculadoraPage.validarCalcularDesabilitado();
})

test('Validar mensagem de erro e depois realização do cálculo após correção do valor', async ({ page }) => {
    // Após o usuário digitar 2 valores, sendo um deles inválido, corrigir informando um valor válido, então o cálculo deve ser realizado normalmente.
    // Também realizar o teste com os 2 valores inválidos, e os 3 valores inválidos

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);
    await page.goto('/');
    // Ação com um campo inválido
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('-');
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('50');
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await calculadoraPage.validarSemDestaqueMsgErro('campoCafe');
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toHaveValue('10.0');
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação com dois campos inválidos
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoAgua.fill('-500');
    await calculadoraPage.campoCafe.fill('a');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um valor maior que zero.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await expect(calculadoraPage.mensagemProporcao).not.toBeVisible();
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('');
    await calculadoraPage.campoProporcao.fill('15');
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await calculadoraPage.validarSemDestaqueMsgErro('campoAgua');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await calculadoraPage.validarSemDestaqueMsgErro('campoCafe');
    await expect(calculadoraPage.mensagemCafe).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Café (g)');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('33.3');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação com três campos inválidos
    await calculadoraPage.reiniciarCalculadora();
    await calculadoraPage.campoAgua.fill('a');
    await calculadoraPage.campoCafe.fill('-');
    await calculadoraPage.campoProporcao.fill('0');
    // Validação
    await calculadoraPage.validaDestaqueMensagemErro('campoAgua', 'Informe um número válido.');
    await calculadoraPage.validaDestaqueMensagemErro('campoCafe', 'Informe um número válido.');
    await calculadoraPage.validaDestaqueMensagemErro('campoProporcao', 'Informe um valor maior que zero.');
    await calculadoraPage.validarCalcularDesabilitado();
    // Ação
    await calculadoraPage.campoAgua.fill('');
    await calculadoraPage.campoCafe.fill('50');
    await calculadoraPage.campoProporcao.fill('15');
    // Validação
    await expect(calculadoraPage.mensagemAgua).toHaveText('Este valor será calculado automaticamente.');
    await calculadoraPage.validarSemDestaqueMsgErro('campoAgua');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await calculadoraPage.validarSemDestaqueMsgErro('campoCafe');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await calculadoraPage.validarSemDestaqueMsgErro('campoProporcao');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Água (ml)');
    // Ação
    await calculadoraPage.clicarCalcular();
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('750');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await calculadoraPage.validarCalcularDesabilitado();
});