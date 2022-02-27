/* Dependências */
import { useNavigate } from 'react-router-dom';

/* Imagens */
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

/* SASS */
import '../styles/auth.scss'

/* Componentes */
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth';


/* Página Home */
export function Home() {
    /* Função que habilita a navegação entre páginas */
    const history = useNavigate();
    /* Função que fará a o login com o Google, e pegará seu contexto */
    const { user, signInWithGoogle } = useAuth();

    /* Função da Página NewRoom */
    function handleCreateRoom() {
        /* Se o usuário não logar, ficará no login do Google */
        /* E não passará para a page NewRoom */
        if (!user) {
            signInWithGoogle();
        }

        /* Se logar, irá para a page rooms/new */
        history('/rooms/new');
    }

    /* Que retornará esse HTML */
    return (
        <div id='page-auth'>
            <aside>
                <img src={illustrationImg} alt="Imagem de ilustração" />
                <strong>Crie salas de Q&amp;A Ao Vivo</strong>
                <p>Tire suas dúvidas em tempo real.</p>
            </aside>
            <main>
                <div className='main-content'>
                    <img src={logoImg} alt="Logo LetMeAsk" />
                    <button onClick={handleCreateRoom} className='create-room'>
                        <img src={googleIconImg} alt="Logo do Google" />
                        Crie sua sala com o Google
                    </button>
                    <div className="separator">ou entre em uma sala</div>
                    <form>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                        />
                        <Button type='submit'>
                            Entrar na sala
                        </Button>
                    </form>
                </div>
            </main>
        </div>
    )
}
