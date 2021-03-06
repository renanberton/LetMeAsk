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
import { Question } from '../components/Question/index';
import { useRoom } from '../hooks/useRoom';


/* Tipagem para pegar o parâmetro ID da sala */
type RoomParams = {
    id: string,
}

export function Room() {
    /* Variável responsável por armazenar o parâmetro ID da sala, que usa a tipagem RoomParams como referência */
    const params = useParams<RoomParams>();

    /* Variáveis responsáveis por novas perguntas nas salas */
    const [newQuestion, setNewQuestion] = useState('');

    /* Variável que retorna a autenticação do usuário */
    const { user } = useAuth();

    /* Variável que armazena o ID da Sala */
    const roomId = params.id!;

    /* Variável que irá armazenar o titulo e o conteúdo da pergunta */
    const { title, questions } = useRoom(roomId)


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

        /* Variável que irá armazenar o conteúdo da pergunta do usuário. Junto do seu nome e foto de usuário. */
        const question = {
            content: newQuestion,
            author: {
                name: user?.name,
                avatar: user.avatar,
            },

            /* Se a pergunta está sendo respondida atualmente. E se já foi respondida ou não. */
            isHighLighted: false,
            isAnswered: false,
        };

        /* Salvará as informações no banco de dados e Adicionará a questão no database na URL questions */
        await database.ref(`rooms/${roomId}/questions`).push(question);

        /* Ao enviar a pergunta, isso aqui 'esvazia' o campo da pergunta, deixando o campo em branco */
        setNewQuestion('');

    }

    /* Função responsável pelos likes na página */
    async function handleLikeQuestion(questionId: string, likeId: string | undefined) {
        /* Se já tiver dado like e clicar novamente no icone do like, ele remove o like */
        if (likeId) {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes/${likeId}`).remove();
            /* Se não, ele add o like ao clicar no icone de like */
        } else {
            await database.ref(`rooms/${roomId}/questions/${questionId}/likes`).push({
                authorId: user?.id,
            })
        }
    }

    return (
        <div id="page-room">
            <header>
                <div className='content'>
                    <img src={logoImg} alt="Logo LetMeAsk" />
                    {/* Parte responsável por exibir o código da sala no front-end E que ao clicar no elemento, salva o valor no clipboard */}
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
                    Se o usuário estiver logado, será exibido seu avatar e o seu user.name Caso não estiver logado, será exibido 'Para enviar uma pergunta, faça seu login' */}
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
                                {/* Condicional, caso a pergunta não tenha sido respondida, é possível dar like
                                Caso já tenha sido respondida, o botão de like nao aparece
                                Aqui não precisamos do fragment <> pois é só um elemento.
                                O React só reclama quando são + que 1 elemento
                                */}
                                {!question.isAnswered && (
                                    <button
                                        className={`like-button ${question.likeId ? 'liked' : ''}`}
                                        type="button"
                                        aria-label='Marcar como Gostei'
                                        onClick={() => handleLikeQuestion(question.id, question.likeId)}
                                    >
                                        {question.likeCount > 0 && <span>{question.likeCount} </span>}
                                        {/* Add o svg na mão, pois se importar não é possível alterar a cor do SVG  */}
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M7 22H4C3.46957 22 2.96086 21.7893 2.58579 21.4142C2.21071 21.0391 2 20.5304 2 20V13C2 12.4696 2.21071 11.9609 2.58579 11.5858C2.96086 11.2107 3.46957 11 4 11H7M14 9V5C14 4.20435 13.6839 3.44129 13.1213 2.87868C12.5587 2.31607 11.7956 2 11 2L7 11V22H18.28C18.7623 22.0055 19.2304 21.8364 19.5979 21.524C19.9654 21.2116 20.2077 20.7769 20.28 20.3L21.66 11.3C21.7035 11.0134 21.6842 10.7207 21.6033 10.4423C21.5225 10.1638 21.3821 9.90629 21.1919 9.68751C21.0016 9.46873 20.7661 9.29393 20.5016 9.17522C20.2371 9.0565 19.9499 8.99672 19.66 9H14Z" stroke="#737380" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>

                                    </button>
                                )}
                            </Question>
                        );
                    })}
                </div>
            </main >
        </div >
    )
}