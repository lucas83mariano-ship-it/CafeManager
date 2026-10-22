export const endpointsApi = {
    BaseUrl: 'http://localhost:8000/',
    Login: 'login/',
    UsuarioEmail: 'usuarios/email/',
    UsuarioMe: 'usuarios/me',
    UsuarioId: 'usuarios/',
    UsuarioRole: (id) => `usuarios/${id}/role`,
    UsuarioSenha: (id) => `usuarios/${id}/senha`,
}
 