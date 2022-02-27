import { createContext, ReactNode, useEffect, useState } from 'react';
import { auth, firebase } from '../services/firebase'

/* Pegará os dados do usuário cadastrado */
export const AuthContext = createContext({} as AuthContextType);

/* Tipagem para User */
type User = {
    id: string;
    name: string;
    avatar: string;
}

/* Tipagem para o os dados de Autenticação do Usuário */
type AuthContextType = {
    user: User | undefined;
    signInWithGoogle: () => Promise<void>;
}

/* Tipagem para dizer que estamos passando um children no props */
type AuthContextProviderProps = {
    children: ReactNode;
}

/* E passamos o props aqui */
export function AuthContextProvider(props: AuthContextProviderProps) {

    /* Variáveis para armazenar os dados do usuário */
    /* Tipagem feita para o User     \/ exibir os dados que serão coletados */
    const [user, setUser] = useState<User>();

    /* O useEffect recebe 2 parâmetros, a função que desejamos disparar
      E um array
      É um eventListener change, se houver mudanças, ele dispara a função 
      de autenticação e fica com os dados salvos, mesmo dando F5
    */
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(user => {
            if (user) {
                const { displayName, photoURL, uid } = user

                /* Se não, retornará a mensagem 'Missing Information from Google Account */
                if (!displayName || !photoURL) {
                    throw new Error('Missing Information from Google Account');
                }

                /* Seta a informação do Usuário */
                setUser({
                    id: uid,
                    name: displayName,
                    avatar: photoURL
                })
            }
        })

        /* Feito para parar o eventListener da autenticação
        Evitando assim que ele fique rodando durante TODA a aplicação
        Evitando possíveis erros 
         */
        return () => {
            unsubscribe();
        }
    }, [])

    /* Função Logar com o Google */
    async function signInWithGoogle() {
        /* Variável que fará a autenticação com o Google */
        /* E outra que exibirá o Pop-up para logar */
        const provider = new firebase.auth.GoogleAuthProvider();
        const result = await auth.signInWithPopup(provider);

        /* Se o usuário logar, as variáveis displayName, photoURL e uid pegarão os valores contidos em user. */
        if (result.user) {
            const { displayName, photoURL, uid } = result.user

            /* Se não, retornará a mensagem 'Missing Information from Google Account */
            if (!displayName || !photoURL) {
                throw new Error('Missing Information from Google Account');
            }

            /* Seta a informação do Usuário */
            setUser({
                id: uid,
                name: displayName,
                avatar: photoURL
            })
        }
    }
    return (
        <AuthContext.Provider value={{ user, signInWithGoogle }}>
            {props.children}
        </AuthContext.Provider>


    )
}