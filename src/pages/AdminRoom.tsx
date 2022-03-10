/* Dependências */
import { useParams } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Question } from '../components/Question/index';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';
import { useNavigate } from 'react-router-dom';


/* Componentes */
import { Button } from '../components/Button';
import { RoomCode } from '../components/RoomCode';

/* Imagens */
import logoImg from '../assets/images/logo.svg';
import deleteImg from '../assets/images/delete.svg'
import checkImg from '../assets/images/check.svg'
import answerImg from '../assets/images/answer.svg'

/* SCSS */
import '../styles/room.scss';



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

    /* Função responsável por exibir que a pergunta já foi respondida */
    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true,
        });
    }

    /* Função responsável por exibir que a pergunta está em destaque */
    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighLighted: true,
        });
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
                                isAnswered={question.isAnswered}
                                isHighLighted={question.isHighLighted}
                            >
                                {/* Condicional, caso a resposta não esteja respondida, ele exibe os botões
                                Caso ela for respondida, os botões não serão + exibidos em tela
                                */}
                                {!question.isAnswered && (
                                    /* Isso <> é um fragmento, é um elemento que só aparece no React e não é exibido no HTML
                                    Estamos usando ele, pois para exibir 2 elementos um do lado do outro, eles precisam estar 'isolados' por containers
                                    E se agente add uma div, ela quebra o CSS, por isso usaremos o fragmento <>
                                    */
                                    <>
                                        {/* Botão para marcar como respondida */}
                                        < button type='button'
                                            onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                            <img src={checkImg} alt="Marcar Pergunta como respondida" />
                                        </button>
                                        {/* Botão para marcar a pergunta como destaque */}
                                        <button
                                            type='button'
                                            onClick={() => handleHighlightQuestion(question.id)}>
                                            <img src={answerImg} alt="Dar destaque a pergunta" />
                                        </button>
                                    </>
                                )
                                }
                                {/* Botão para remover a pergunta */}
                                < button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                        );
                    })}
                </div>
            </main >
        </div >
    )
}