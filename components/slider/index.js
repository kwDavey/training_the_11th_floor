import Slick from 'react-slick';
import styles from './styles.module.scss';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

export default function Slider({ settings, overlay, children }) {
    return (
        <>
            <div className={styles.slider}>
                {overlay && <div className={styles.overlay}>{overlay}</div>}
                <div>
                    <Slick {...settings}>{children}</Slick>
                </div>
            </div>
        </>
    );
}

export function Slide({ children }) {
    return <div className={styles['slide']}>{children}</div>;
}

export function Sectionslider({ children }) {
    return <div className={styles['sectionslider slick-dots']}>{children}</div>;
}

export function BannerSlider({ children }) {
    return <div className={styles.bannerslider}>{children}</div>;
}
