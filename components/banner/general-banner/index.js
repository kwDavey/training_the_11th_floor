import styles from './styles.module.scss';

export default function GeneralBanner({title, subtitle, image}) {
    return (
        <div style={{ background: `url('${image}')`, backgroundSize: 'cover' }} className={`${styles.overlayCon} grid grid_vertical-align-center size_1-of-1`}>
            <div className={`${styles.overlay} grid size_1-of-1 grid_vertical grid_align-center`}>
            {/* Original Code
            <div className={`${styles.overlay} grid size_1-of-1 grid_vertical-align-center grid_align-center text-case_upper`}>
                <h1 className={`${styles.hover} padding-around_medium text-weight_thin text-size_title-small text-align_center`}>{title}</h1>
            */}
                <h1 style={{ color: 'white' }} className={`${styles.hover} padding-around_medium text-weight_thin text-size_title-small text-case_upper text-align_center`}>{title}</h1>
                <div style={{ color: 'white' }} className={`padding-around_medium text-weight_thin text-align_center`}>{subtitle}</div>
            </div>
        </div>
    );
}
