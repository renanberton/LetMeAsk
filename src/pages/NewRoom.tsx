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
import { FormEvent } from 'react';
import { useState } from 'react';
import { database } from '../services/firebase';
import { useNavigate } from 'react-router-dom';

/* Exporta a função NewRoom() */
export function NewRoom() {
    const { user } = useAuth();

    const history = useNavigate();

    /* Variáveis para armazenar o nome da sala, digitado pelo usuário no input do formulário */
    const [newRoom, setNewRoom] = useState('');

    /* Função que auxiliará na criação de novas salas */
    async function handleCreateRoom(event: FormEvent) {
        /* Previne o comportamento padrão do form */
        event.preventDefault();

        if (newRoom.trim() === '') {
            return;
        }

        /* Parecido com uma linha dos dbs convencionais */
        const roomRef = database.ref('rooms');

        /* O push, funciona para add 1 nova sala em 'rooms' la no banco de dados , instanciado por roomRef que salvará o título salvo por roomRef(), + o id do usuário. */
        const firebaseRoom = await roomRef.push({
            title: newRoom,
            authorId: user?.id,
        })

        /* Cria a rota para a sala, a partir do código da mesma. */
        history(`/rooms/${firebaseRoom.key}`);
    }

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
                    {/* Ao enviar o submit a função handleCreateRoom será executada e previnirá o comportamento padrão do submit no formulário, que seria de  
                    enviar para outra página.*/}
                    <form onSubmit={handleCreateRoom}>
                        <input
                            type="text"
                            placeholder='Nome da Sala'
                            /* Ao realizar mudanças no valor do input, usaremos a função setNewRoom Que será responsável por armazenar o nome da sala digitado pelo usuário. */
                            onChange={event => setNewRoom(event.target.value)}
                            value={newRoom}
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
