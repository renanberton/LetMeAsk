/* Dependências
Responsável pelas rotas da aplicação
Responsável pela autenticação, que está em outra pasta
*/
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { AuthContextProvider } from './contexts/AuthContext'

/* Páginas */
import { Home } from "./pages/Home"
import { NewRoom } from "./pages/NewRoom";
import { Room } from "./pages/Room";
import { AdminRoom } from "./pages/AdminRoom"

function App() {
  return (
    /* Dependencia que cria as rotas para a aplicação */
    <BrowserRouter>
      {/* Todas as pages terão acesso aos dados do usuário logado e poderão fazer o login com o Google */}
      {/* Pois terá + de 1 local para o usuário fazer log-in */}
      <AuthContextProvider>
        {/* As rotas da aplicação */}
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/rooms/new" element={<NewRoom />} />
          <Route path="/rooms/:id" element={<Room />} />
          <Route path="/admin/rooms/:id" element={<AdminRoom />} />
        </Routes>
      </ AuthContextProvider>
    </BrowserRouter >
  );
}
export default App;
