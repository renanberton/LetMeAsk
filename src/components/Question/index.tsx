/* Dependências */
import { ReactNode } from 'react';

/* Estilo */
import './styles.scss'

/* Tipagem para as questões */
type QuestionProps = {
    content: string;
    author: {
        name: string;
        avatar: string;
    };
    children?: ReactNode;
    isAnswered?: boolean;
    isHighLighted?: boolean;
}

/* Função das questões */
export function Question({
    content,
    author,
    isAnswered = false,
    isHighLighted = false,
    children,
}: QuestionProps) {
    return (
        <div className={`question ${isAnswered ? 'answered' : ''} ${isHighLighted && !isAnswered ? 'highLighted' : ''}`}
        >
            <p>
                {content}
            </p>
            <footer>
                <div className="user-info">
                    <img src={author.avatar} alt={author.name} />
                    <span>{author.name}</span>
                </div>
                {/* Likes */}
                <div>
                    {children}
                </div>
            </footer>
        </div >
    );
}