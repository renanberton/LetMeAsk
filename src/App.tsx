/* Dependências */
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { createContext, useState } from 'react'
import { auth, firebase } from '../src/services/firebase'

/* Páginas */
import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom";

type User = {
  id: string;
  name: string;
  avatar: string;
}

type AuthContextType = {
  user: User | undefined;
  signInWithGoogle: () => Promise<void>;
}

export const AuthContext = createContext({} as AuthContextType);

function App() {

  /* Tipagem feita para o User     \/ exibir os dados que serão coletados */
  const [user, setUser] = useState<User>();

  /* Função Logar com o Google */
  async function signInWithGoogle() {
    /* Variável que fará a autenticação com o Google */
    const provider = new firebase.auth.GoogleAuthProvider();
    const result = await auth.signInWithPopup(provider);

    /* Se o usuário ligar, as variáveis displayName, photoURL e uid pegarão os valores contidos em user. */
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
    /* Dependencia que cria as rotas para a aplicação */
    <BrowserRouter>
      {/* Todas as pages terão acesso aos dados do usuário logado e poderão fazer o login com o Google */}
      {/* Pois terá + de 1 local para o usuário fazer log-in */}
      <AuthContext.Provider value={{ user, signInWithGoogle }}>
        {/* As rotas da aplicação */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
        </Routes>
      </AuthContext.Provider>
    </BrowserRouter >
  );
}
export default App;
