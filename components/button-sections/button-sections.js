import styles from './button-sections.module.scss';
import Link from 'next/link';

export default function Buttonsection({ title, img, type = 'normal', subtext, href = '' }) {
    if (type === 'normal') {
        return (
            <Link href={href} passHref>
                <a href="" target="_self">
                    <div style={{ background: `url(${img})`, backgroundSize: 'cover' }} className={`${styles['container']} grid grid_align-center grid_vertical-align-center`}>
                        <div className={`${styles['section']} grid grid_vertical grid_vertical-align-center grid_align-center`}>
                            <h1 className={`${styles.hover} padding-around_medium text-weight_thin text-size_title-small`}>{title}</h1>
                        </div>
                    </div>
                </a>
            </Link>
        );
    } else if (type === 'large') {
        return (
            <Link href={href} passHref>
                <a href="" target="_self">
                    <div style={{ background: `url(${img})`, backgroundSize: 'cover' }} className={`${styles['largeContainer']} grid grid_align-center grid_vertical-align-center`}>
                        <div className={`${styles[`largeSection`]} grid grid_vertical grid_vertical-align-center grid_align-center`}>
                            <h1 className={`${styles.largeTitle} padding-around_medium text-weight_thin text-size_title-small text-case_upper text-align_center`}>{title}</h1>
                            <div className="padding-top_large">
                                <p className={`${styles.subtext} text-weight_thin text-case_upper text-size_medium text-style_italic whiteish-text`}>{subtext}</p>
                            </div>
                        </div>
                    </div>
                </a>
            </Link>
        );
    } else if (type === 'small') {
        return (
            <Link href={href} passHref>
                <a href="" target="_self">
                    <div style={{ background: `url(${img})`, backgroundSize: 'cover' }} className={`${styles['smallContainer']} grid grid_align-center grid_vertical-align-center text-align_center`}>
                        <div className={`${styles[`smallSection`]} grid grid_vertical grid_vertical-align-center grid_align-center`}>
                            <h1 className={`${styles.hover} padding-around_medium text-weight_thin text-size_xxxx-large`}>{title}</h1>
                        </div>
                    </div>
                </a>
            </Link>
        );
    }
}
