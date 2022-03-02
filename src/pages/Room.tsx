/* Imagens */
import logoImg from '../assets/images/logo.svg';

/* Componentes */
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

/* SCSS */
import '../styles/room.scss';

/* Dependências */
import { useParams } from 'react-router-dom';
import { FormEvent, useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { database } from '../services/firebase';


/* Tipagem para pegar o parâmetro ID da sala */
type RoomParams = {
    id: string,
}

/* Tipagem para as questões do firebase, Aonde tem um objeto dentro de outro objeto
*/
type FirebaseQuestions = Record<string, {
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;
}>

/* Tipagem para as informações das perguntas da aplicação */
type Question = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }
    content: string;
    isAnswered: boolean;
    isHighlighted: boolean;

}

export function Room() {
    /* Variável responsável por armazenar o parâmetro ID da sala, que usa a tipagem RoomParams como referência */
    const params = useParams<RoomParams>();

    /* Variável que armazena o ID da Sala */
    const roomId = params.id;

    /* Variáveis responsáveis por novas perguntas nas salas */
    const [newQuestion, setNewQuestion] = useState('');

    /* Variável que retorna a autenticação do usuário */
    const { user } = useAuth();

    /* Variável que irá armazenar o estado das perguntas  */
    const [questions, setQuestions] = useState<Question[]>([]);

    /* Variáveis que armazenarão o título das perguntas e o seu estado. */
    const [title, setTitle] = useState('');

    /* Dispara um evento, sempre que uma informação mudar, é parecido com o AddEventListener('change', ()) */
    useEffect(() => {
        /* Variável que procura o id da sala no Banco de Dados */
        const roomRef = database.ref(`rooms/${roomId}`);

        /* Sempre que mudar algo em roomId, esse código será executado \/ */
        roomRef.on('value', room => {
            /* Variável que busca as perguntas no banco de dados */
            const databaseRoom = room.val()
            const firebaseQuestions: FirebaseQuestions = databaseRoom.questions ?? {};

            /* Variável que armazena os valores das questões, como uma matriz de array e os retorna depois. */
            const parsedQuestions = Object.entries(firebaseQuestions).map(([key, value]) => {
                return {
                    id: key,
                    content: value.content,
                    author: value.author,
                    isHighlighted: value.isHighlighted,
                    isAnswered: value.isAnswered,
                }
            })

            /* Altera o Título da sala e o seu estado */
            setTitle(databaseRoom.title);

            /* Altera a pergunta e o seu estado */
            setQuestions(parsedQuestions);
        })

        /* Toda vez que o roomId mudar, os dados da nova sala será recarregado e o trecho de código acima será executado novamente. */
    }, [roomId])

    /* Função responsável por enviar as perguntas ao app */
    async function handleSendQuestion(event: FormEvent) {
        event.preventDefault();

        if (newQuestion.trim() === '') {
            return;
        }

        /* Caso o usuário não estiver logado, retornará o seguinte erro: */
        if (!user) {
            throw new Error('Você precisa estar logado para esta ação.')
        }

        /* Variável que irá armazenar o conteúdo da pergunta do usuário.
        Junto do seu nome e foto de usuário.
        */
        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user.avatar,
            },

            /* Se a pergunta está sendo respondida atualmente.
            E se já foi respondida ou não.
            */
            isHighlighted: false,
            isAnswered: false,
        };

        /* Salvará as informações no banco de dados
        Adicionará a questão no database na URL questions
        */
        await database.ref(`rooms/${roomId}/questions`).push(question);

        /* Ao enviar a pergunta, isso aqui 'esvazia' o campo da pergunta, deixando o campo em branco */
        setNewQuestion('');

    }

    return (
        <div id="page-room">
            <header>
                <div className='content'>
                    <img src={logoImg} alt="Logo LetMeAsk" />
                    {/* Parte responsável por exibir o código da sala no front-end 
                    E que ao clicar no elemento, salva o valor no clipboard
                    */}
                    <RoomCode code={roomId} />
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {/* Se tiver + que 1 pergunta, sexibirá o número específido de perguntas */}
                    {questions.length > 0 && <span> {questions.length} perguntas  </span>}
                </div>

                {/* Ao enviar o submit, chamará a função handleSendQuestion */}
                <form onSubmit={handleSendQuestion}>
                    <textarea
                        placeholder="Qual a sua dúvida ?"
                        onChange={event => setNewQuestion(event.target.value)}
                        value={newQuestion}
                    />
                    <div className="form-footer">
                        {/* Condicional ternária
                    Se o usuário estiver logado, será exibido seu avatar e o seu user.name
                    Caso não estiver logado, será exibido 'Para enviar uma pergunta, faça seu login'

                    */}
                        {user ? (
                            <div className="user-info">
                                <img src={user.avatar} alt={user.name} />
                                <span>{user.name}</span>
                            </div>
                        ) : (
                            <span>Para enviar uma pergunta,
                                <button>Faça seu login.</button>
                            </span>
                        )}

                        {/* O botão estará desativado caso o usuário não estiver logado */}
                        <Button type="submit" disabled={!user}>Enviar Pergunta</Button> {/* Nosso Componente */}
                    </div>
                </form>
                {JSON.stringify(questions)}
            </main>
        </div>
    )
}