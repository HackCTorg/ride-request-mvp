import {styles} from "../../../server/style/styles";

export default function ConditionallyActiveButton({onClickFn, text, isEnabled}) {

    const cssClass = isEnabled ? styles.enabledButton : styles.disabledButton;

    return (
        <button disabled = {!isEnabled} onClick={onClickFn} className = {cssClass}>
            {text}
        </button>
    )
}