import styles from './styles.module.scss';
import Link from 'next/link';

export default function Button({ label, variant = 'primary', type = 'button', ...options }) {
    const getButtonClass = () => {
        const classList = [styles.button];
        switch (variant) {
            case 'primary': {
                classList.push(styles.primary);
                break;
            }
            case 'secondary': {
                classList.push(styles.secondary);
                break;
            }
            case 'DarkBackground': {
                classList.push(styles.DarkBackground);
                break;
            }
            case 'white': {
                classList.push(styles.white);
                break;
            }

            case 'CopperBackgroundLightActive': {
                classList.push(styles.CopperBackgroundLightActive);
                break;
            }

            case 'CopperBackgroundLight': {
                classList.push(styles.CopperBackgroundLight);
                break;
            }

            case 'CopperBackgroundDark': {
                classList.push(styles.CopperBackgroundDark);
                break;
            }
            case 'CopperBackgroundDarkActive': {
                classList.push(styles.CopperBackgroundDarkActive);
                break;
            }
        }

        if (options.hasOwnProperty('size')) {
            switch (options.size) {
                case 'medium': {
                    classList.push(styles.size_medium);
                    break;
                }
                case 'large': {
                    classList.push(styles.size_large);
                    break;
                }
                case 'small': {
                    classList.push(styles.size_small);
                    break;
                }
                case 'fill': {
                    classList.push(styles.size_fill);
                    break;
                }
            }
        }
        if (options.hasOwnProperty('fluid')) {
            classList.push('size_1-of-1');
        }
        return classList.join(' ');
    };

    const getWrapperClass = () => {
        const classList = [styles.wrapper];

        if (options.hasOwnProperty('class')) {
            classList.push(styles[options.class]);
        }

        if (options.hasOwnProperty('size')) {
            switch (options.size) {
                case 'xsmall': {
                    classList.push(styles.size_xsmall);
                    break;
                }
                case 'fill': {
                    classList.push(styles.size_fill);
                    break;
                }
            }
        }

        return classList.join(' ');
    };

    const getSliderClass = () => {
        const classList = [styles.slide];

        switch (variant) {
            case 'primary': {
                classList.push(styles.slide_primary);
                break;
            }
            case 'secondary': {
                classList.push(styles.slide_secondary);
                break;
            }
            case 'DarkBackground': {
                classList.push(styles.slide_dark);
                break;
            }

            case 'white': {
                classList.push(styles.slide_white);
                break;
            }

            case 'CopperBackgroundLight': {
                classList.push(styles.slide_CopperLight);
                break;
            }

            case 'CopperBackgroundDark': {
                classList.push(styles.slide_CopperDark);
                break;
            }
        }
        return classList.join(' ');
    };

    if (type === 'button') {
        return (
            <div className={getWrapperClass()} onClick={options.onClick}>
                <button className={getButtonClass()} target={options.target} href={options.href} id={options.ID}>
                    {label}
                </button>

                <div className={getSliderClass()}></div>
            </div>
        );
    }
    if (type === 'link') {
        return (
            <div className={getWrapperClass()}>
                <Link href={options.href}>
                    <a className={getButtonClass()} target={options.target} href={options.href}>
                        {label}
                    </a>
                </Link>

                <div className={getSliderClass()}></div>
            </div>
        );
    }
}
