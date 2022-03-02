/* Imagens */
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'

/* Componentes */
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

/* SCSS */
import '../styles/room.scss';

/* Dependências */
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Question } from '../components/Question/index';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useNavigate } from 'react-router-dom';


/* Tipagem para pegar o parâmetro ID da sala */
type RoomParams = {
    id: string,
}

export function AdminRoom() {
    /* Variável responsável por alterar a rota do usuário */
    const history = useNavigate()

    /* Variável responsável por armazenar o parâmetro ID da sala, que usa a tipagem RoomParams como referência */
    const params = useParams<RoomParams>();

    /* Variável que retorna a autenticação do usuário */
    const { user } = useAuth();

    /* Variável que armazena o ID da Sala */
    const roomId = params.id!;

    /*Variável que armazena o título e o conteúdo da pergunta  */
    const { title, questions } = useRoom(roomId)

    /* Função responsável por encerrar a sala quando o usuário assim desejar */
    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            /* Guarda a info no DATABASE de quando a sala foi encerrada */
            endedAt: new Date(),
        })

        /* Caso o usuário encerrar a sala, ele será redirecionado para a home */
        history('/');
    }


    /* Função responsável por deletar a pergunta no AdminRoom O usuário confirma se quer ou não deletar a pergunta */
    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que deseja remover essa pergunta?')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className='content'>
                    <img src={logoImg} alt="Logo LetMeAsk" />
                    {/* Parte responsável por exibir o código da sala no front-end E que ao clicar no elemento, salva o valor no clipboard */}
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrar Sala</Button>
                    </div>
                </div>
            </header>
            <main>
                <div className="room-title">
                    <h1>Sala {title}</h1>
                    {/* Se tiver + que 1 pergunta, sexibirá o número específido de perguntas */}
                    {questions.length > 0 && <span> {questions.length} perguntas  </span>}
                </div>
                {/* Div responsável por exibir as questões na sala O map funciona como um forEach, porém permite que retorne algo. */}
                <div className="question-list">
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                            >
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main>
        </div>
    )
}