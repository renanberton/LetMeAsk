/* Dependências */
import { Navigate, useNavigate } from 'react-router-dom';

/* Imagens */
import illustrationImg from '../assets/images/illustration.svg';
import logoImg from '../assets/images/logo.svg';
import googleIconImg from '../assets/images/google-icon.svg';

/* SASS */
import '../styles/auth.scss'

/* Componentes */
import { Button } from '../components/Button'
import { useAuth } from '../hooks/useAuth';
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';


/* Página Home */
export function Home() {
    /* Função que habilita a navegação entre páginas */
    const history = useNavigate();
    /* Função que fará a o login com o Google, e pegará seu contexto */
    const { user, signInWithGoogle } = useAuth();

    const [roomCode, setRoomCode] = useState('');

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

    /* Função para verificar se a sala existe */
    async function handleJoinRoom(event: FormEvent) {
        event.preventDefault();

        if (roomCode.trim() === '') {
            return;
        }

        /* Variável responsável por armazenar o código da sala.
        Que será procurado no banco de dados, pelo get()
        */
        const roomRef = await database.ref(`rooms/${roomCode}`).get()

        /* Caso a sala não existe, ele retorna a mensagem
        Avisando que a sala não existe.
        */
        if (!roomRef.exists()) {
            alert('A sala especificada não existe.');
        } else {
            /* Caso exista, o usuário será redirecionado para a sala */
            history(`/rooms/${roomCode}`)
        }

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
                    <form onSubmit={handleJoinRoom}>
                        <input
                            type="text"
                            placeholder='Digite o código da sala'
                            onChange={event => setRoomCode(event.target.value)}
                            value={roomCode}
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
