import { test, expect } from '@playwright/test';
import { CalculadoraPage } from './pages/calculadora.page';
import { SidebarComponent } from './components/sidebar.component';
import { CafePage } from './pages/cafes.page';
import { HeaderComponent } from './components/header.component';

test ('Validar exibição de menu sem login', async ({ page}) => {
    // Acessar o site sem login e confirmar exibição do menu Calculadora, botão Entrar e tela Calculadora

    const sidebar = new SidebarComponent(page);
    const calculadoraPage = new CalculadoraPage(page);

    await page.goto('/');
    await expect(sidebar.tituloSidebar).toBeVisible();
    await expect(sidebar.menuCalculadora).toBeVisible();
    await expect(sidebar.menuCafes).not.toBeVisible();
    await expect(sidebar.menuReceitas).not.toBeVisible();
    await expect(sidebar.botaoAbrirLogin).toBeVisible();
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