import styles from './circle-content.module.scss';
import { useState } from 'react';
import { WindowSize } from '@Modules';

export default function Circlecontent({ img, content, left, right }) {
    const device = WindowSize();
    return (
        <div>
            {left === 'true' && device.width > 1000 && (
                <div className="grid ">
                    <div>
                        <img className={styles.circleLeft} src={img} alt="" />
                    </div>
                    <div className="grid grid_align-end">
                        <div className="size_5-of-6 padding-right_xxxx-large" style={{ height: '30rem', background: 'rgba(255,255,255,.2)', position: 'relative', zIndex: '1' }}>
                            <div style={{ height: '100%' }} className="grid grid_vertical grid_vertical-align-end grid_align-center">
                                <div style={{ fontSize: '2rem', fontWeight: '200', color: 'white', lineHeight: '1.5' }} className="size_4-of-6 padding-md-right_none padding-lg-right_xx-large">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {device.width < 1000 && (
                <div className="">
                    <div className="grid grid_align-center padding-vertical_large">
                        <img className={`${styles['circleLeft-small']}`} src={img} alt="" />
                    </div>
                    <div style={{ height: '100%', background: 'rgba(255,255,255,.2)' }} className="grid grid_vertical grid_vertical-align-end grid_align-center padding-around_large">
                        <div style={{ fontSize: '1.5rem', fontWeight: '200', color: 'white', lineHeight: '1.5' }} className="size_1-of-1` padding-md-right_none padding-lg-right_xx-large">
                            {content}
                        </div>
                    </div>
                </div>
            )}

            {right === 'true' && device.width > 720 && (
                <div className="grid">
                    <div>
                        <img className={styles.circleRight} src={img} alt="" />
                    </div>
                    <div className="grid grid_align-start">
                        <div className="size_5-of-6 " style={{ height: '30rem', background: 'rgba(255,255,255,.2)', position: 'relative', zIndex: '1' }}>
                            <div style={{ height: '100%' }} className="grid grid_vertical grid_vertical-align-start grid_align-center">
                                <div style={{ fontSize: '2rem', fontWeight: '200', color: 'white', lineHeight: '1.5' }} className="size_4-of-6 padding-left_xxxx-large">
                                    {content}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
