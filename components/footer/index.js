import styles from './footer.module.scss';

export default function Footer() {
    return (
        <div className="grid grid-wrap size_1-of-1 padding-top_xx-large">
            <div className="grid small-grid-wrap size_1-of-1 grid_vertical-align-center  grid-small_vertical grid-small_align-start grid-large_align-even">
                <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                    <img src="/img/icons/phone.svg" alt="phone" className={`${styles.footerIcons} large-size_none size_1-of-1 small-size_1-of-1 small-size_1-of-1`} />
                    <a className="padding-top_xxx-small large-size_none size_1-of-1 small-size_1-of-1 text-align_center" href="tel:+27725135743">
                        <p className=" text-size_medium whiteish-text padding-left_xx-small">+27 72 513 5743</p>
                    </a>
                </div>
                <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                    <img src="/img/icons/mail.svg" alt="phone" className={`${styles.footerIcons} `} />
                    <a className="padding-top_xxx-small large-size_none size_1-of-1 small-size_1-of-1 text-align_center" href="mailto:reservations@the11thfloor.co.za">
                        <p className="text-size_medium whiteish-text padding-left_small">reservations@the11thfloor.co.za</p>
                    </a>
                </div>
                <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                    <img src="/img/icons/clock.svg" alt="phone" className={`${styles.footerIcons} `} />
                    <a className="padding-top_xxx-small large-size_none size_1-of-1 small-size_1-of-1 text-align_center">
                        <p className="text-size_medium whiteish-text padding-left_small">Mon - Thu: 10:30 - 22:00 | Fri - Sat: 10:30 - 00:00 | Sun: 10:30 - 19:00 </p>
                    </a>
                </div>
                <div className="grid grid_align-center large-padding-vertical_none padding-vertical_medium">
                    <a href="https://m.facebook.com/The11thFloorView/">
                        <img src="/img/icons/facebook.svg" alt="phone" className={`${styles.footerIcons} `} />
                    </a>
                    <a href="https://instagram.com/the11thfloorview?utm_medium=copy_link">
                        <img src="/img/icons/instagram.svg" alt="phone" className={`${styles.footerIcons} `} />
                    </a>
                </div>
                <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                    <p className=" text-size_medium whiteish-text padding-left_xx-small">No cash accepted</p>
                </div>
            </div>
            <div className="grid size_1-of-1 grid-wrap padding-top_xx-large grid_align-center grid_vertical-align-center large-padding-top_large text-align_center">
                <div className="white-text padding-horizontal_x-small large-size_none size_1-of-3">28 Bradford Road </div>
                <div className="white-text padding-horizontal_x-small show-large">|</div>
                <div className="white-text padding-horizontal_x-small large-size_none size_1-of-3">Bedfordview </div>
                <div className="white-text padding-horizontal_x-small show-large">|</div>
                <div className="white-text padding-horizontal_x-small large-size_none size_1-of-3">2007 </div>
            </div>
            <div className="grid size_1-of-1 grid-wrap grid_align-center large-padding-top_small text-align_center">
                <div className="white-text padding-horizontal_x-small large-size_none size_1-of-1">Located in Nicol Corner, on the 11th floor</div>
            </div>
        </div>
    );
}
