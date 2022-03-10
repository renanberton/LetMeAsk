/* Dependências */
import { useState, useEffect } from "react";
import { database } from "../services/firebase";
import { useAuth } from '../hooks/useAuth';


/* Tipagem para as informações das perguntas da aplicação */
type QuestionType = {
    id: string;
    author: {
        name: string;
        avatar: string;
    }

    content: string;
    isAnswered: boolean;
    isHighLighted: boolean;
    likeCount: number;
    likeId: string | undefined;
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
    isHighLighted: boolean;
    likes: Record<string, {
        authorId: string;
    }>
}>

/* Função responsável pela sala das perguntas */
export function useRoom(roomId: string) {
    /*  */
    const { user } = useAuth();

    /* Variável que irá armazenar o estado das perguntas  */
    const [questions, setQuestions] = useState<QuestionType[]>([]);

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
                    isHighLighted: value.isHighLighted,
                    isAnswered: value.isAnswered,
                    likeCount: Object.values(value.likes ?? {}).length,
                    likeId: Object.entries(value.likes ?? {}).find(([key, like]) => like.authorId === user?.id)?.[0],
                }
            })

            /* Altera o Título da sala e o seu estado */
            setTitle(databaseRoom.title);

            /* Altera a pergunta e o seu estado */
            setQuestions(parsedQuestions);
        })

        /* Retira o eventListener da função */
        return () => {
            roomRef.off('value');
        }
        /* Toda vez que o roomId ou o user.id mudar, os dados da nova sala será recarregado e o trecho de código acima será executado novamente. */
    }, [roomId, user?.id])
    return { questions, title }
}
