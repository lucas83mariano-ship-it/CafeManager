export class SidebarComponent{

    constructor(page) {
        this.page = page;
    }

    get tituloSidebar() {
        return this.page.getByRole('heading', { name: 'Cafe Manager' });
    }

    get menuCafes() {
        return this.page.getByRole('link', { name: 'Cafés' });
    }

    get menuReceitas() {
        return this.page.getByRole('link', { name: 'Receitas' });
    }

    get menuCalculadora() {
        return this.page.getByRole('link', { name: 'Calculadora' });
    }

    async irParaCafes() {
        await this.menuCafes.click();
    }

    async irParaReceitas() {
        await this.menuReceitas.click();
    }

    async irParaCalculadora() {
        await this.menuCalculadora.click();
    }

}