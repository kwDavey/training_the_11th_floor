import styles from './roller.module.css';

export default function roller() {
    return (
        <div className={styles['lds-roller']}>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
        </div>
    );
}
