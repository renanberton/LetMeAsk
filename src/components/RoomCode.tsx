/* Imagens */
import { ProgressPlugin } from 'webpack';
import copyImg from '../assets/images/copy.svg';

/* Estilo SCSS */
import '../styles/room-code.scss';


/* Tipagem para o RoomCode */
type RoomCodeProps = {
    code: any,
}


/* Função para copiar o código da sala para o Clipboard
Ou para o famoso Ctrl + C
*/
export function RoomCode(props: RoomCodeProps) {
    function copyRoomCodeToClipBoard() {
        navigator.clipboard.writeText(props.code);
    }

    return (
        /* Ao clicar, ele chama a função copyRoomCodeToClipBoard */
        <button className="room-code" onClick={copyRoomCodeToClipBoard}>
            <div>
                <img src={copyImg} alt="Copiar o código da sala" />
            </div>
            <span>Sala #{props.code}</span>
        </button>
    )
}