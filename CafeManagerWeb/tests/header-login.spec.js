import { test, expect } from '@playwright/test';
import { CalculadoraPage } from './pages/calculadora.page';
import { SidebarComponent } from './components/sidebar.component';
import { CafePage } from './pages/cafes.page';
import { HeaderComponent } from './components/header.component';
import { LoginPage } from './pages/login.page';
import { log } from 'node:console';

test ('Validar exibição dos campos de login', async ({ page }) => {
    // Validar a exibição dos campos de login (e-mail, senha, entrar) após clicar em Entrar
    
    // Preparação
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await expect(headerComponent.tituloHeader).toBeVisible();
    await expect(headerComponent.linkPerfil).toBeVisible();

    // Ação
    await headerComponent.irParaPerfil();

    // Validação
    await expect(loginPage.tituloPerfil).toBeVisible();
    await expect(loginPage.tituloEntrar).toBeVisible();
    await expect(loginPage.campoEmail).toBeVisible();
    await expect(loginPage.campoSenha).toBeVisible();
    await expect(loginPage.botaoEntrar).toBeVisible();
    await expect(loginPage.botaoCriarConta).toBeVisible();
    await expect(loginPage.botaoVoltar).toBeVisible();
});

test ('Validar login com sucesso', async ({ page }) => {
    // Validar que após realizar login serão exibidos os menus de Cafés e Receitas. A tela ainda deve ser da Calculadora.
    
    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await expect(headerComponent.tituloHeader).toBeVisible();
    await expect(headerComponent.linkPerfil).toBeVisible();

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.campoEmail.fill('admin@admin.com');
    await loginPage.campoSenha.fill('AdminUsu123*');
    await loginPage.fazerLogin();
   
    // Validação
    await expect(sidebar.menuCafes).toBeVisible();
    await expect(sidebar.menuReceitas).toBeVisible();
    await expect(sidebar.menuCalculadora).toBeVisible();
    await expect(headerComponent.tituloHeader).toBeVisible();
    await expect(headerComponent.linkPerfil).toContainText('admin@admin.com');
    await expect(calculadoraPage.titulo).toBeVisible();
    await expect(calculadoraPage.campoAgua).toBeVisible();
    await expect(calculadoraPage.campoAgua).toBeEmpty();
    await expect(calculadoraPage.campoCafe).toBeVisible();
    await expect(calculadoraPage.campoCafe).toBeEmpty();
    await expect(calculadoraPage.campoProporcao).toBeVisible();
    await expect(calculadoraPage.campoProporcao).toBeEmpty();
    await expect(calculadoraPage.botaoReiniciar).toBeVisible();
    await expect(calculadoraPage.botaoCalcular).toBeDisabled();
});

test ('Validar logout com sucesso', async ({ page }) => {
    // Validar que após realizar logout serão ocultados os menus de Cafés e Receitas, o usuário será redirecionado para a tela de Calculadora, e no header o link de perfil deverá exibir a palavra Perfil.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);

    // Ação
    await page.goto('/');
    await headerComponent.irParaPerfil();
    await loginPage.loginAdmin();

    // Validação
    await expect(headerComponent.linkPerfil).toContainText('admin@admin.com');
    await calculadoraPage.camposVisiveisVazios();

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.fazerLogout();

    // Validação
    await expect(sidebar.menuCafes).not.toBeVisible();
    await expect(sidebar.menuReceitas).not.toBeVisible();
    await expect(sidebar.menuCalculadora).toBeVisible();
    await calculadoraPage.camposVisiveisVazios();
    await expect(headerComponent.linkPerfil).toContainText('Perfil');
});

test ('Validar exibição de todos os cafés para login com Usuário que possui role Admin', async ({ page }) => {
    // Validar o acesso ao menu Cafés e a exibição de todos os cafés cadastrados para um usuário com role Admin.
    
    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const cafePage = new CafePage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await headerComponent.irParaPerfil();

    // Ação
    await loginPage.campoEmail.fill('admin@admin.com');
    await loginPage.campoSenha.fill('AdminUsu123*');
    await loginPage.fazerLogin();
   
    // Validação
    await sidebar.loginExibeTodosMenus();
    await calculadoraPage.camposVisiveisVazios();

    // Ação
    await sidebar.irParaCafes();

    // Validação
    await expect(cafePage.tituloCafes).toBeVisible();
    await expect(cafePage.totalCafes).toContainText('Total de cafés: 4');

    // Ação de logout
    await loginPage.acaoCompletaLogout();

    // Validação
    await expect(headerComponent.linkPerfil).toContainText('Perfil');
});

test ('Validar exibição dos cafés do Usuário que possui role User', async ({ page }) => {
    // Validar o acesso ao menu Cafés e a exibição de todos os cafés cadastrados para um usuário com role User.
    
    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const cafePage = new CafePage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);

    await page.goto('/');
    await headerComponent.irParaPerfil();

    // Ação
    await loginPage.campoEmail.fill('monicamendonca66@gmail.com');
    await loginPage.campoSenha.fill('Admin2*');
    await loginPage.fazerLogin();
   
    // Validação
    await sidebar.loginExibeTodosMenus();
    await calculadoraPage.camposVisiveisVazios();

    // Ação
    await sidebar.irParaCafes();

    // Validação
    await expect(cafePage.tituloCafes).toBeVisible();
    await expect(cafePage.totalCafes).toContainText('Total de cafés: 2');

    // Ação de logout
    await loginPage.acaoCompletaLogout();

    // Validação
    await expect(headerComponent.linkPerfil).toContainText('Perfil');
});

//test ('Validar mensagens de erro no login');