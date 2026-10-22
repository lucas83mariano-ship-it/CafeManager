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
    await loginPage.login2('lucas83mariano@gmail.com');
   
    // Validação
    await sidebar.loginExibeTodosMenus();
    await calculadoraPage.calculadoraInicial();

    // Ação
    await sidebar.irParaCafes();

    // Validação
    //await loginPage.qtdeCafesAdmin();
    await expect(cafePage.tabelaCafes).toBeVisible();
    await expect(cafePage.headTabela).toContainText('Pontuação');
    //await expect(cafePage.tituloCafes).toBeVisible();
    //await expect(cafePage.totalCafes).toContainText('Total de cafés: 4');
//
    //// Ação de logout
    //await loginPage.acaoCompletaLogout();
//
    //// Validação
    //await expect(headerComponent.linkPerfil).toContainText('Perfil');
});