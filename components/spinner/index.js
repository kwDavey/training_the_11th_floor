import Roller from './type/roller';
import styles from './spinner.module.scss';
export default function spinner(props) {
    return <div className={styles.container}>{props.type === 'roller' && <Roller />}</div>;
}
