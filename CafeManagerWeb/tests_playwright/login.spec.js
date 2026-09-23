import { test, expect, request } from '@playwright/test';
import { CalculadoraPage } from './pages/calculadora.page';
import { SidebarComponent } from './components/sidebar.component';
import { CafePage } from './pages/cafes.page';
import { HeaderComponent } from './components/header.component';
import { LoginPage } from './pages/login.page';
import { PerfilComponent } from './components/perfil.component';
import { PerfilPage } from './pages/perfil.page';
import { log } from 'node:console';
import { UsuariosPage } from './pages/usuarios.page';

test ('Validar exibição dos campos de login', async ({ page }) => {
    // Validar a exibição dos campos de login (e-mail, senha, entrar) após clicar em Entrar
    
    // Preparação
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);
    const perfilComponent = new PerfilComponent(page);

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
    await expect(perfilComponent.botaoCriarConta).toBeVisible();
    await expect(perfilComponent.botaoVoltar).toBeVisible();
});

test ('Validar login com sucesso com usuário Admin', async ({ page }) => {
    // Validar que após realizar login com usuário que possui role='admin', serão exibidos os menus de Cafés, Receitas, Calculadora, Usuários. A tela ainda deve ser da Calculadora.
    
    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);
    const perfilComponent = new PerfilComponent(page);
    const perfilPage = new PerfilPage(page);
    const usuario = loginPage.listaUsuarios.filter(usuario => usuario.nome === 'Admin');

    await page.goto('/');
    await expect(headerComponent.tituloHeader).toBeVisible();
    await expect(headerComponent.linkPerfil).toBeVisible();

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.login2(usuario[0]);
   
    // Validação
    await sidebar.loginExibeTodosMenus();
    await expect(headerComponent.tituloHeader).toBeVisible();
    await expect(headerComponent.linkPerfil).toContainText(usuario[0].email);
    await calculadoraPage.calculadoraInicial();
    await headerComponent.irParaPerfil();
    await expect(perfilPage.dadosPerfil).toContainText('Administrador');
});

test ('Validar login com sucesso com usuário User', async ({ page }) => {
    // Validar que após realizar login com usuário que possui role='user', serão exibidos os menus de Cafés, Receitas e Calculadora. A tela ainda deve ser Calculadora

    //Preparação
    const sidebar = new SidebarComponent(page);
    const loginPage = new LoginPage(page);
    const calculadoraPage = new CalculadoraPage(page);
    const headerComponent = new HeaderComponent(page);
    const perfilComponent = new PerfilComponent(page);
    const perfilPage = new PerfilPage(page);
    const usuario = loginPage.listaUsuarios.filter(usuario => usuario.nome === 'Mônica');

    await page.goto ('/');

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.login2(usuario[0]);

    // Validação
    await sidebar.loginMenusUser();
    await expect(headerComponent.linkPerfil).toContainText(usuario[0].email);
    await calculadoraPage.calculadoraInicial();
    await headerComponent.irParaPerfil();
    await expect(perfilPage.dadosPerfil).toContainText('Amante de Café');
});

test ('Validar logout do Admin com sucesso', async ({ page }) => {
    // Validar que após realizar logout de usuário com role='admin', serão ocultados os menus de Cafés, Receitas e Usuários, o usuário será redirecionado para a tela de Calculadora, e no header o link de perfil deverá exibir a palavra Perfil.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);
    const perfilPage = new PerfilPage(page);
    const usuario = loginPage.listaUsuarios.filter(usuario => usuario.nome === 'Admin');

    await page.goto('/');

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.login(usuario[0]);

    // Validação
    await expect(headerComponent.linkPerfil).toContainText(usuario[0].email);
    await calculadoraPage.calculadoraInicial();

    // Ação
    await loginPage.acaoCompletaLogout();

    // Validação
    await sidebar.sidebarInicial();
    await calculadoraPage.calculadoraInicial();
    await expect(headerComponent.linkPerfil).toContainText('Perfil');
});

test ('Validar logout do User com sucesso', async ({ page }) => {
    // Validar que após realizar logout de usuário com role='user', serão ocultados os menus de Cafés e Receitas, o usuário será redirecionado para a tela de Calculadora, e no header o link de perfil deverá exibir a palavra Perfil.

    //Preparação
    const sidebar = new SidebarComponent(page);
    const headerComponent = new HeaderComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const loginPage = new LoginPage(page);
    const perfilPage = new PerfilPage(page);

    await page.goto('/');

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.login2('monicamendonca66@gmail.com');

    // Validação
    await expect(headerComponent.linkPerfil).toContainText('monicamendonca66@gmail.com');
    await sidebar.loginMenusUser();
    await calculadoraPage.calculadoraInicial();

    // Ação
    await loginPage.acaoCompletaLogout();

    // Validação
    await sidebar.sidebarInicial();
    await calculadoraPage.calculadoraInicial();
    await expect(headerComponent.linkPerfil).toContainText('Perfil');
});

test ('Validar login com sucesso com todos os usuários', async ({ page }) => {
    // Validar que o login será feito com sucessos para todos os usuários da lista.

    const calculadoraPage = new CalculadoraPage(page);
    const sidebarComponent = new SidebarComponent(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page);
    const perfilComponent = new PerfilComponent(page);
    const perfilPage = new PerfilPage(page);

    for (const usuario of loginPage.listaUsuarios) {
        await page.goto('/');
        await headerComponent.irParaPerfil();
        await loginPage.login(usuario);
        await expect(headerComponent.linkPerfil).toContainText(usuario.email);
        await calculadoraPage.calculadoraInicial();
        await headerComponent.irParaPerfil();
        if (await perfilPage.dadosPerfil.textContent() === 'Perfil: Administrador') {
            await perfilPage.perfilEBotoes.screenshot({ path: `cafemanagerweb/screenshots/screenshot_${usuario.nome}.png`, fullPage: true });
            await sidebarComponent.loginExibeTodosMenus();
            await loginPage.acaoCompletaLogout();
        }
            else {
                await perfilPage.perfilEBotoes.screenshot({ path: `cafemanagerweb/screenshots/screenshot_${usuario.nome}.png`, fullPage: true });
                await sidebarComponent.loginMenusUser();
                await loginPage.acaoCompletaLogout();
            }
    }
});
