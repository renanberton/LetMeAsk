/* Imagens */
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import { useContext } from 'react';


/* SASS */
import '../styles/auth.scss'

/* Componentes */
import { Button } from '../components/Button'

/* Dependências */
import { Link } from 'react-router-dom';
import { AuthContext } from '../App';



export function NewRoom() {
    const { user } = useContext(AuthContext);

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
                    <h1>{user?.name}</h1>
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
