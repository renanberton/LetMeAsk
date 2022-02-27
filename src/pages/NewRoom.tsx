/* Imagens */
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';

/* SASS */
import '../styles/auth.scss'

/* Componentes */
import { Button } from '../components/Button'

/* Dependências */
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';


export function NewRoom() {
    const { user } = useAuth();

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
                    <h2>Criar uma nova sala</h2>
                    <form>
                        <input
                            type="text"
                            placeholder='Nome da Sala'
                        />
                        <Button type='submit'>
                            Criar Sala
                        </Button>
                    </form>
                    <p>
                        Quer entrar em uma sala existente? <Link to="/">clique aqui</Link>
                    </p>
                </div>
            </main>
        </div>
    )
}
