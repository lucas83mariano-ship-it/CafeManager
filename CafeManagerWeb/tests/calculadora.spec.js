import { test, expect } from '@playwright/test';
import { CalculadoraPage } from './pages/calculadora.page';
import { SidebarComponent } from './components/sidebar.component';
import { LoginPage } from './pages/login.page';
import { CafePage } from './pages/cafes.page';

test('Acessar o site Cafe Manager', async ({ page }) => { 
    // Validar o acesso ao site Café Manager, e exibição da tela inicial

    // Preparação
    const sidebar = new SidebarComponent(page);

    // Ação
    await page.goto('/');
    
    // Validação
    await expect(page.getByText('Sistema de gerenciamento de cafés')).toBeVisible();
    await expect(sidebar.tituloSidebar).toHaveText('Cafe Manager');
    await expect(sidebar.menuCafes).toBeVisible();
    await expect(sidebar.menuReceitas).toBeVisible();
    await expect(sidebar.menuCalculadora).toBeVisible();
});

test('Acessar a Calculadora', async ({ page }) => {
    // Validar o acesso ao menu Calculadora, e exibição dos objetos
    
    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await expect(sidebar.tituloSidebar).toBeVisible();
    
    // Ação
    await sidebar.irParaCalculadora();
    
    // Validação
    await expect(calculadoraPage.titulo).toBeVisible();
    await expect(calculadoraPage.campoAgua).toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeVisible();
    await expect(calculadoraPage.botaoReiniciar).toBeVisible();
    await expect(calculadoraPage.botaoCalcular).toBeVisible();
});

test('Preencher cada campo e validar os comportamentos dos campos e do botão Calcular', async ({ page }) => {
    // O botão Calcular deve permanecer com nome "Calcular" e inacessível enquanto o usuário preencher apenas um campo.
    // O campo preenchido deve exibir o valor digitado, enquanto os outros devem permanecer vazios.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();
    
    // Ação
    await calculadoraPage.campoAgua.fill('500');

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.mensagemCafe).not.toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).not.toBeVisible();
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Proporção');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Água (ml)');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Café (g)');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('');
    await calculadoraPage.campoCafe.fill('30');

    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.mensagemAgua).not.toBeVisible();
    await expect(calculadoraPage.campoCafe).toHaveValue('30');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.mensagemProporcao).not.toBeVisible();
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Proporção');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Água (ml)');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Café (g)');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoCafe.fill('');
    await calculadoraPage.campoProporcao.fill('15');

    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.mensagemAgua).not.toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.mensagemCafe).not.toBeVisible();
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Proporção');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Água (ml)');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Café (g)');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('30');
    await calculadoraPage.campoProporcao.fill('15');

    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('30');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Proporção');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Água (ml)');
    await expect(calculadoraPage.botaoCalcular).not.toHaveText('Calcular Café (g)');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular');
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();

});

test ('Validar o funcionamento do botão reiniciar', async ({ page }) => {
    // O clique no botão Reiniciar deve excluir qualquer valor existente em qualquer um dos campos da calculadora.

    // Preparação

    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.botaoReiniciar.click();
    
    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('30');
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('30');
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await calculadoraPage.botaoReiniciar.click();

    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('30');
    await calculadoraPage.campoProporcao.fill('15');
    await expect(calculadoraPage.campoAgua).toHaveValue('500');
    await expect(calculadoraPage.campoCafe).toHaveValue('30');
    await expect(calculadoraPage.campoProporcao).toHaveValue('15');
    await calculadoraPage.botaoReiniciar.click();

    // Validação
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
});

test ('Validar cálculo automático da Proporção', async ({ page }) => {
    // Sempre que o usuário preencher dois campos com valores > 0, então o terceiro campo deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular + nome do campo que receberá o resultado do cálculo'. 

    //Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();
    await expect(calculadoraPage.titulo).toBeVisible();
    await expect(calculadoraPage.campoAgua).toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeVisible();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoCafe.fill('30');
    await expect(calculadoraPage.mensagemProporcao).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Proporção');
    await calculadoraPage.botaoCalcular.click();
    
    // Validação
    await expect(calculadoraPage.campoProporcao).toHaveValue('16.7');
    console.log('Cálculo da proporção correto');
});

test ('Validar cálculo automático da Água (ml)', async ({ page }) => {
    // Sempre que o usuário preencher dois campos com valores > 0, então o terceiro campo deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular + nome do campo que receberá o resultado do cálculo'.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();
    await expect(calculadoraPage.titulo).toBeVisible();
    await expect(calculadoraPage.campoAgua).toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeVisible();
    await expect(calculadoraPage.botaoCalcular).toBeVisible();

    // Ação
    await calculadoraPage.campoCafe.fill('30');
    await calculadoraPage.campoProporcao.fill('15');
    await expect(calculadoraPage.mensagemAgua).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Água (ml)');
    await calculadoraPage.botaoCalcular.click();
    
    // Validação
    await expect(calculadoraPage.campoAgua).toHaveValue('450');
    console.log('Cálculo da água correto');
});

test ('Validar cálculo automático do Café (g)', async ({ page }) => {
    // Sempre que o usuário preencher dois campos com valores > 0, então o terceiro campo deve exibir a mensagem 'Este valor será calculado automaticamente.' e o botão de calcular deve assumir o nome 'Calcular + nome do campo que receberá o resultado do cálculo'.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await sidebar.irParaCalculadora();
    await expect(calculadoraPage.titulo).toBeVisible();
    await expect(calculadoraPage.campoAgua).toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeVisible();
    await expect(calculadoraPage.botaoCalcular).toBeVisible();

    // Ação
    await calculadoraPage.campoAgua.fill('500');
    await calculadoraPage.campoProporcao.fill('15');
    await expect(calculadoraPage.mensagemCafe).toHaveText('Este valor será calculado automaticamente.');
    await expect(calculadoraPage.botaoCalcular).toHaveText('Calcular Café (g)');
    await calculadoraPage.botaoCalcular.click();

    // Validação
    await expect(calculadoraPage.campoCafe).toHaveValue('33.3');
    console.log('Cálculo do café correto');
});

test ('Não deve apagar um valor originalmente calculado após edição manual', async ({ page }) => {
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

test ('Validar destaque de erro e mensagem de erro para valor=0', async ({ page }) => {
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

test ('Validar destaque de erro e mensagem de erro para valor=string', async ({ page }) => {
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

test ('Validar mensagem de erro e depois realização do cálculo após correção do valor', async ({ page }) => {
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