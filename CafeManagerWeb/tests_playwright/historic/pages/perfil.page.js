export class PerfilPage {
    
    constructor (page) {
        this.page = page;
    }

    get tituloMinhaConta() {
        return this.page.getByRole('heading', { name: 'Minha Conta' });
    }

    get dadosPerfil() {
        return this.page.locator('//p[3]');
    }

    // Botões

    get botaoAlterarDados() {
        return this.page.getByRole('button', { name: 'Alterar dados' });
    }

    get botaoAlterarSenha() {
        return this.page.getByRole('button', { name: 'Alterar senha' });
    }

    get botaoExcluirConta() {
        return this.page.getByRole('button', { name: 'Excluir conta' });
    }

    get botaoSair() {
        return this.page.getByRole('button', { name: 'Sair' });
    }

    // Ações da página (métodos)

    async clicarAlterarDados() {
        await this.botaoAlterarDados.click();
    }

    async clicarAlterarSenha() {
        await this.botaoAlterarSenha.click();
    }

    async clicarExcluirConta() {
        await this.botaoExcluirConta.click();
    }

    async clicarSair() {
        await this.botaoSair.click();
    }

    // Para screenshot
    get perfilEBotoes() {
        return this.page.locator('//*[@id="root"]/div/div/main/div');
    }

}