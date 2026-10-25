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
        await calculadoraPage.resetarCalculadora();
        await calculadoraPage.calculadoraEstadoInicial();
    }
});

test('Validar cálculo automático da Proporção', async ({ page }) => {
    // Sempre que o usuário preencher dois campos com valores > 0, então o terceiro campo deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular + nome do campo que receberá o resultado do cálculo'. 
    // Refatoração também envolveu corrigir alguns apontamentos, visto que houve alteração na arquitetura do projeto.

    //Preparação
    const calculadoraPage = new CalculadoraPage(page);

    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('465');
    await calculadoraPage.campoCafe.fill('31');
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    await calculadoraPage.realizarCalculo();

    // Validação
    const resultado = await calculadoraPage.campoProporcao.inputValue();
    expect(Number(resultado)).toBe(15);
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
});

test('Validar cálculo automático da Água_ml', async ({ page }) => {
    // Sempre que o usuário preencher dois campos com valores > 0, então o terceiro campo deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular + nome do campo que receberá o resultado do cálculo'.
    // Refatoração também envolveu corrigir alguns apontamentos, visto que houve alteração na arquitetura do projeto.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);

    // Ação
    await page.goto('/');
    await calculadoraPage.campoCafe.fill('31');
    await calculadoraPage.campoProporcao.fill('15');
    await expect(calculadoraPage.mensagemAgua).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Água (ml)');
    await calculadoraPage.realizarCalculo();

    // Validação
    const resultado = await calculadoraPage.campoAgua.inputValue();
    expect(Number(resultado)).toBe(465);
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
});

test('Validar cálculo automático do Café_g', async ({ page }) => {
    // Sempre que o usuário preencher dois campos com valores > 0, então o terceiro campo deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular + nome do campo que receberá o resultado do cálculo'.
    // Refatoração também envolveu corrigir alguns apontamentos, visto que houve alteração na arquitetura do projeto.

    // Preparação
    const calculadoraPage = new CalculadoraPage(page);

    // Ação
    await page.goto('/');
    await calculadoraPage.campoAgua.fill('465');
    await calculadoraPage.campoProporcao.fill('15');
    await expect(calculadoraPage.mensagemCafe).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Café (g)');
    await calculadoraPage.realizarCalculo();

    // Validação
    const resultado = await calculadoraPage.campoCafe.inputValue();
    expect(Number(resultado)).toBe(31);
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
});

test('Não deve apagar um valor originalmente calculado após edição manual', async ({ page }) => {
    // Validar que o sistema não irá apagar um valor que foi originalmente calculado, mas posteriormente editado manualmente pelo usuário.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();

    // Ação
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
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');

    // Ação
    await calculadoraPage.botaoCalcular.click();

    // Validação
    await expect(calculadoraPage.campoProporcao).toHaveValue('16.7');

    // Ação
    await calculadoraPage.campoProporcao.fill('11');
    await calculadoraPage.campoCafe.fill('');

    // Validação
    await expect(calculadoraPage.campoProporcao).toHaveValue('11');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.mensagemCafe).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Café (g)');

    // Ação
    await calculadoraPage.botaoCalcular.click();

    // Validação
    await expect(calculadoraPage.campoCafe).toHaveValue('45.5');
});

test('Validar destaque de erro e mensagem de erro para valor=0', async ({ page }) => {
    // Sempre que o usuário digitar valor =0, então os campos deverão receber destaque com contorno em vermelho, e deve ser exibido a mensagem 'Informe um valor maior que zero'.
    // O botão Calcular deve permanecer inacessível.
    // Caso o usuário preencha um campo=0 e outro campo>0, então o botão Calcular deve permanecer com esse nome e inacessível, além de não ser exibida a mensagem de cálculo automático no terceiro campo.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();

    // Ação
    await calculadoraPage.campoAgua.fill('0');

    // Verificação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('0');

    // Verificação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('0');
    await calculadoraPage.campoCafe.fill('0');
    await calculadoraPage.campoProporcao.fill('0');

    // Verificação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.destaqueErroProporcao).toBeVisible();
    await expect(calculadoraPage.mensagemErroProporcao).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('');
    await calculadoraPage.campoCafe.fill('');
    await calculadoraPage.campoProporcao.fill('');

    // Verificação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.destaqueErroAgua).not.toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).not.toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.destaqueErroCafe).not.toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).not.toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.destaqueErroProporcao).not.toBeVisible();
    await expect(calculadoraPage.mensagemErroProporcao).not.toBeVisible();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});

test('Validar destaque de erro e mensagem de erro para valor=string', async ({ page }) => {
    // Sempre que o usuário digitar valor =0, então os campos deverão receber destaque com contorno em vermelho, e deve ser exibido a mensagem 'Informe um número válido.'.
    // O botão Calcular deve permanecer inacessível.
    // Caso o usuário preencha um campo<0 e outro campo>0, então o botão Calcular deve permanecer com esse nome e inacessível, além de não ser exibida a mensagem de cálculo automático no terceiro campo.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();

    // Ação
    await calculadoraPage.campoAgua.fill('-');

    // Validação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('-');
    await calculadoraPage.campoCafe.fill('-');

    // Validação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('-');
    await calculadoraPage.campoCafe.fill('-');
    await calculadoraPage.campoProporcao.fill('-');

    // Validação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.destaqueErroProporcao).toBeVisible();
    await expect(calculadoraPage.mensagemErroProporcao).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('');
    await calculadoraPage.campoCafe.fill('');
    await calculadoraPage.campoProporcao.fill('');

    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.destaqueErroAgua).not.toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).not.toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.destaqueErroCafe).not.toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).not.toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.destaqueErroProporcao).not.toBeVisible();
    await expect(calculadoraPage.mensagemErroProporcao).not.toBeVisible();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});

test('Validar mensagem de erro e depois realização do cálculo após correção do valor', async ({ page }) => {
    // Após o usuário digitar 2 valores, sendo um deles inválido, corrigir informando um valor válido, então o cálculo deve ser realizado normalmente.
    // Também realizar o teste com os 2 valores inválidos, e os 3 valores inválidos

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();

    // Ação com um campo inválido
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('-');

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('50');

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');

    // Ação
    await calculadoraPage.botaoCalcular.click();

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toHaveValue('10.0');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação com dois campos inválidos
    await calculadoraPage.botaoReiniciar.click();
    await calculadoraPage.campoAgua.fill('-500');
    await calculadoraPage.campoCafe.fill('-');

    // Validação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('50');

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');

    // Ação
    await calculadoraPage.botaoCalcular.click();

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toHaveValue('10.0');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação com três campos inválidos
    await calculadoraPage.botaoReiniciar.click();
    await calculadoraPage.campoAgua.fill('-500');
    await calculadoraPage.campoCafe.fill('-');
    await calculadoraPage.campoProporcao.fill('0');

    // Validação
    await expect(calculadoraPage.destaqueErroAgua).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.destaqueErroCafe).toBeVisible();
    await expect(calculadoraPage.mensagemErroCafe).toHaveText('Informe um número válido.');
    await expect(calculadoraPage.destaqueErroProporcao).toBeVisible();
    await expect(calculadoraPage.mensagemErroAgua).toHaveText('Informe um valor maior que zero.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('');
    await calculadoraPage.campoCafe.fill('50');
    await calculadoraPage.campoProporcao.fill('15');

    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.mensagemAgua).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Água (ml)');

    // Ação
    await calculadoraPage.botaoCalcular.click();

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('750');
    await expect(calculadoraPage.campoCafe).toHaveValue('50');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});