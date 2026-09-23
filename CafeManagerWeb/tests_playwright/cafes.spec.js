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
    await loginPage.campoEmail.fill(loginPage.listaUsuarios[2].email);
    await loginPage.campoSenha.fill(loginPage.listaUsuarios[2].senha);
    await loginPage.clicarEntrar();
   
    // Validação
    await sidebar.loginMenusUser();
    await calculadoraPage.calculadoraInicial();

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

test ('Validar exibição de todos os usuários para login com Usuário Admin', async ({ page, request }) => {
    // Validar que todos os usuários cadastrados serão exibidos para um usuário com role Admin. Também será feita comparação do resultado recebido na API com o resultado exibido no menu Usuários.

    // Preparação
    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);
    const headerComponent = new HeaderComponent(page);
    const loginPage = new LoginPage(page,request);
    const perfilPage = new PerfilPage(page);
    const usuariosPage = new UsuariosPage(page);
    const idsApi = await loginPage.apiAdminQtdeUsuarios(); // Faz login na API, realiza um get no endpoint '/usuarios' e armazena a lista de IDs, recebidos na resposta em json, em um array de números.

    await page.goto('/');

    // Ação
    await headerComponent.irParaPerfil();
    await loginPage.login2('admin@admin.com');
    await sidebar.loginExibeTodosMenus();
    await headerComponent.irParaPerfil();

    // Validação
    await expect(perfilPage.dadosPerfil).toContainText('Perfil: Administrador');
    
    // Ação
    await sidebar.irParaUsuarios();
    const idsFront = await usuariosPage.colunaID.evaluateAll(
        list => list.map(element => Number(element.textContent))); // Armazena a lista de IDs exibidos na tela em um array de string de números convertido em números.
    
    // Validação
    expect(idsApi).toEqual(idsFront);  
});