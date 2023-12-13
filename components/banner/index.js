import styles from './styles.module.scss';
import { WindowSize } from '@Modules';
import SwiperCore, { Autoplay } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/autoplay';
import { useState } from 'react';

SwiperCore.use([Autoplay]);

export default function Banner({ children, extra }) {
    const device = WindowSize();
    const [sliderHeight, setSliderHeight] = useState(800);

    if (device.width > 1400 && sliderHeight !== 800) {
        setSliderHeight(800);
    }
    if (device.width <= 1400 && device.width > 1024 && sliderHeight !== 700) {
        setSliderHeight(700);
    }
    if (device.width <= 1024 && device.width > 768 && sliderHeight !== 600) {
        setSliderHeight(600);
    }
    if (device.width <= 768 && sliderHeight !== 400) {
        setSliderHeight(400);
    }

    return (
        <>
            <div style={{ height: sliderHeight }}>
                <div style={{ height: '100%', position: 'relative' }}>
                    <div style={{ height: sliderHeight, position: 'relative' }}>
                        <Swiper autoHeight={true} speed={2000} slidesPerView={1} autoplay={{ delay: 3000 }} loop={true}>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/home.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            WELCOME TO <br />
                                            AN ELEVATED VIEW
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/soak.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            SOAK IN <br />
                                            THE BEAUTIFUL SKYLINE
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/glass.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            AVAILABLE FOR <br />
                                            EXCLUSIVE BOOKINGS
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/bar.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            MENU ITEMS AS SUPERB <br />
                                            AS THE VIEWS
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/heart.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            IN THE HEART <br />
                                            OF BEDFORDVIEW
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/restaurant.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            ROOFTOP RESTAURANT &amp; <br />
                                            COCKTAIL BAR
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/inspired.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">ITALIAN INSPIRED</div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/senses.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            YOUR SENSES <br />
                                            WILL BE SATISFIED
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/views.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">BREATHTAKING VIEWS</div>
                                    </div>
                                </div>
                            </SwiperSlide>
                            <SwiperSlide>
                                <div style={{ width: '100%', height: sliderHeight, position: 'relative' }}>
                                    <img style={{ position: 'absolute', zIndex: '-1' }} className="object-fit object-fit_cover" src="/img/banners/mesmerising.png" alt="" />
                                    <div className="grid grid_align-center grid_vertical-align-center fill-height">
                                        <div className="text-align_center title-text">
                                            A MESMERISING <br />
                                            EXPERIENCE
                                        </div>
                                    </div>
                                </div>
                            </SwiperSlide>
                        </Swiper>
                    </div>
                    {/* <div style={{ position: 'absolute', zIndex: 10, top: 0, height: sliderHeight, width: '100%' }}>{children}</div> */}
                    <div style={{ position: 'absolute', bottom: 0, height: sliderHeight, width: '100%', zIndex: 10 }}>
                        {device.width >= 1024 && (
                            <div className="grid grid_vertical grid_vertical-align-center grid_align-center" style={{ color: 'white', position: 'absolute', bottom: 0, left: 0, width: '100%', height: '100px', background: 'rgba(0, 0, 0, 0.5)' }}>
                                <div className="section-content">
                                    <div className="grid small-grid-wrap size_1-of-1 grid_vertical-align-center  grid-small_vertical grid-small_align-start grid-large_align-even">
                                        <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                                            <img src="/img/icons/phone.svg" alt="phone" className="large-size_none size_1-of-1 small-size_1-of-1 small-size_1-of-1" style={{ width: '30px', height: '30px' }} />
                                            <a className="padding-top_xxx-small large-size_none size_1-of-1 small-size_1-of-1 text-align_center" href="tel:+27725135743">
                                                <p className=" text-size_medium whiteish-text padding-left_xx-small">+27 72 513 5743</p>
                                            </a>
                                        </div>
                                        <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                                            <img src="/img/icons/mail.svg" alt="phone" style={{ width: '30px', height: '30px' }} />
                                            <a className="padding-top_xxx-small large-size_none size_1-of-1 small-size_1-of-1 text-align_center" href="mailto:reservations@the11thfloor.co.za">
                                                <p className="text-size_medium whiteish-text padding-left_small">reservations@the11thfloor.co.za</p>
                                            </a>
                                        </div>
                                        <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                                            <img src="/img/icons/clock.svg" alt="phone" style={{ width: '30px', height: '30px' }} />
                                            <a className="padding-top_xxx-small large-size_none size_1-of-1 small-size_1-of-1 text-align_center">
                                                <p className="text-size_medium whiteish-text padding-left_small">Mon - Thu: 10:30 - 22:00 | Fri - Sat: 10:30 - 00:00 | Sun: 10:30 - 19:00 </p>
                                            </a>
                                        </div>
                                        <div className="grid large-padding-vertical_none  padding-vertical_medium">
                                            <a href="https://m.facebook.com/The11thFloorView/">
                                                <img src="/img/icons/facebook.svg" alt="phone" style={{ width: '30px', height: '30px' }} />
                                            </a>
                                            <a href="https://instagram.com/the11thfloorview?utm_medium=copy_link">
                                                <img src="/img/icons/instagram.svg" alt="phone" style={{ width: '30px', height: '30px' }} />
                                            </a>
                                        </div>
                                        <div className="grid grid-wrap large-padding-vertical_none  padding-vertical_medium large-size_none size_1-of-1 small-size_1-of-1  grid_align-center">
                                            <p className=" text-size_medium whiteish-text padding-left_xx-small">No cash accepted</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}
