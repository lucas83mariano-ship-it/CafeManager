import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import { login as loginService } from "../services/auth-service";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [token, setToken] = useState(null);

    const [usuario, setUsuario] = useState(null);

        console.log('AUTH PROVIDER RENDER');
        console.log('TOKEN:', token);
        console.log('USUARIO:', usuario);
        console.log('IS AUTHENTICATED:', !!token);
        console.log(
            'LOCAL STORAGE:',
            localStorage.getItem('access_token')
        );

    useEffect(() => {

        async function carregarUsuario() {

            console.log('AUTH EFFECT EXECUTOU');
            const tokenSalvo = localStorage.getItem("access_token");

            if (!tokenSalvo) {

                return;

            }

            try {

                setToken(tokenSalvo);

                api.defaults.headers.Authorization =
                    `Bearer ${tokenSalvo}`;

                const { data } = await api.get("/usuarios/me");

                setUsuario(data);

            }

            catch (erro) {

                console.log('ERRO NO CARREGAR USUARIO:', erro);
                logout();

            }

        }

        carregarUsuario();

    }, []);

    async function login(email, senha) {

        const resposta = await loginService(email, senha);

        const accessToken = resposta.access_token;

        localStorage.setItem(
            "access_token",
            accessToken
        );

        setToken(accessToken);

        api.defaults.headers.Authorization =
            `Bearer ${accessToken}`;

        const { data } = await api.get("/usuarios/me");

        setUsuario(data);

    }

    function logout() {

        console.log('LOGOUT EXECUTOU');
        localStorage.removeItem("access_token");
        
        delete api.defaults.headers.Authorization;
        
        setToken(null);
        
        setUsuario(null);
        
    }

    function atualizarUsuario(dados) {

        setUsuario(dados);

    }

    const value = {

        token,

        usuario,

        login,

        logout,

        atualizarUsuario,

        isAuthenticated: !!token,

    };

    return (

        <AuthContext.Provider value={value}>

            {children}

        </AuthContext.Provider>

    );

}

export function useAuth() {

    return useContext(AuthContext);

}