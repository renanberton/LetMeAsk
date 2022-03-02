import { ButtonHTMLAttributes } from 'react';
import '../styles/button.scss'

/* O ButtonHTMLAttributes é responsável por definir todos os atributos HTML que o botão pode receber
Ao add o botão em alguma página, ele já irá exibir todos os atributos que o botão pode receber.
*/
type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    isOutlined?: boolean;
};


export function Button({ isOutlined = false, ...props }: ButtonProps) {
    return (
        <button className={`button ${isOutlined ? 'outLined' : ''}`}
            {...props} />
    )
}
