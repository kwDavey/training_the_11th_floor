

import { useEffect, useState, useRef } from 'react';
import ReactDOM from 'react-dom';
import gsap from 'gsap';
import styles from './styles.module.scss';
import { WindowSize } from '@Modules';

import { FormElement, Card, Button } from '@Components';
import Link from 'next/link';

export default function Modal({ data, title, show = false, children, onClose = () => {}, onClosed = () => {}, handleSubmit = () => {}, fields = [], Page = 'Standard', handelBtnPrimarySubmit = () => {}, handelBtnSecondarySubmit = () => {} }) {
    const device = WindowSize();

    const modal = useRef();
    const modalContainer = useRef();
    const [isBrowser, setIsBrowser] = useState(false);
    const [_show, setShow] = useState(false);
    const [scrollPosition, setScrollPosition] = useState(0); // Added state for scroll position
    const DeviceSize = WindowSize();

    useEffect(() => {
        setIsBrowser(true);
    }, []);

    useEffect(() => {
        if (show) {
            setScrollPosition(window.pageYOffset); // Store the current scroll position
            setShow(true);
            document.body.style.overflow = 'hidden'; // Disable scrolling when the modal is open
        } else {
            document.body.style.overflow = ''; // Re-enable scrolling when the modal is closed
            gsap.to(modalContainer.current, {
                opacity: 0,
                y: '50%',
                scale: 0.8,
                duration: 0.4,
                onComplete: () => {
                    setShow(false);
                    onClosed();
                }
            });
        }
    }, [show]);

    useEffect(() => {
        if (Page == 'Standard') {
            if (_show) {
                gsap.fromTo(modalContainer.current, { autoAlpha: 0, y: '50%', height: '50%', width: '50%' }, { autoAlpha: 1, y: 0, height: '80%', width: '80%', duration: 0.4 });
            }
        } else if (Page == 'Home') {
            if (_show) {
                if (DeviceSize.width >= 786) {
                    gsap.fromTo(modalContainer.current, { autoAlpha: 0, y: '50%', height: '50%', width: '50%' }, { autoAlpha: 1, y: 0, height: 'fit-content', width: '98%', maxWidth: '700px', duration: 0.4 });
                } else {
                    gsap.fromTo(modalContainer.current, { autoAlpha: 0, y: '50%', height: '50%', width: '50%' }, { autoAlpha: 1, y: 0, height: 'fit-content', width: '90%', maxWidth: '700px', duration: 0.4 });
                }
            }
        } else {
            if (_show) {
                gsap.fromTo(modalContainer.current, { autoAlpha: 0, y: '50%', height: '50%', width: '50%' }, { autoAlpha: 1, y: 0, height: 'fit-content', width: '98%', maxWidth: '700px', duration: 0.4 });
            }
        }
    }, [_show]);

    var componentBody;
    if (Page == 'Standard') {
        componentBody = _show ? (
            <div ref={modal} className={styles.modal}>
                <div ref={modalContainer} className={styles.modal_container}>
                    <div className={styles.modal_header}>
                        <div className={styles.modal_header_title}>{title}</div>
                        <div className={styles.modal_header_close} onClick={onClose}></div>
                    </div>
                    <div className={styles.modal_content}>{children}</div>
                </div>
                <div className={styles.modal_backdrop}></div>
            </div>
        ) : null;
    }else if (Page == 'ViewTests') {
        componentBody = _show ? (
            <div ref={modal} className={styles.modal}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }} onClick={onClose}></div>
                <div ref={modalContainer} className={styles.modal_container}>
                    <div className={styles.modal_header}>
                        <div className={styles.modal_header_title}>{title}</div>
                        <div className={styles.modal_header_close} onClick={() => onClose()}></div>
                    </div>
                    <div className={styles.modal_content}>
                        <div>
                            <h2 className="size_1-of-1 text-align_center  text-color_copper-medium">Please select an option below</h2>

                            <div className="size_1-of-1 padding-top_large grid grid-wrap">
                                <div className="size_1-of-3 padding-around_large padding-bottom_none">
                                    <Button class="" variant="secondary" type="button" label="Cancel" onClick={() => onClose()}></Button>
                                </div>
                                <div className="size_1-of-3 padding-around_large padding-bottom_none">
                                    <Button class="" variant="secondary" type="button" label="View" onClick={() => handelBtnPrimarySubmit()}></Button>
                                </div>
                                <div className="size_1-of-3 padding-around_large padding-bottom_none">
                                    <Button class="" variant="CopperBackgroundDark" type="button" label="Send" onClick={() => handelBtnSecondarySubmit()}></Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className={styles.modal_backdrop}></div>
            </div>
        ) : null;
    } else if (Page == 'ViewResults') {
        componentBody = _show ? (
            <div ref={modal} className={styles.modal}>
                <div style={{ position: 'absolute', width: '100%', height: '100%' }} onClick={onClose}></div>
                <div ref={modalContainer} className={styles.modal_container} style={{ background: '#022720' }}>
                    <div className="size_1-of-1 grid grid-wrap">
                        <h2 className="size_1-of-1 text-align_center padding-vertical_large">
                            QUESTIONS: <span className="text-size_xx-large">{data.TestName}</span>
                        </h2>
                    </div>
                    <div className="size_1-of-1 text-align_center grid grid-wrap">
                        <div className="grid grid-wrap size_1-of-1 padding-large-left_large padding-large-right_large">
                            {data.TestFields &&
                                data.TestFields.map((field, iCount) => {
                                    return (
                                        <div key={iCount} className="size_1-of-1 medium-size_1-of-2 large-size_1-of-2  padding-around_x-small">
                                            <FormElement ref={field.ref} {...field} />
                                        </div>
                                    );
                                })}
                            {data.SavedTestQuestionFields.map((field, iCount) => {
                                return (
                                    <>
                                        {iCount % 2 == '0' && device.width >= 860 && <div style={{ height: '2px', backgroundColor: 'var(--color-copper-medium)' }} className="size_1-of-1 margin-vertical_large"></div>}
                                        {device.width < 860 && <div style={{ height: '2px', backgroundColor: 'var(--color-copper-medium)' }} className="size_1-of-1 margin-vertical_large"></div>}
                                        <div key={field.id} className="size_1-of-1  medium-size_1-of-2 large-size_1-of-2  padding-around_x-small">
                                            <div className="size_1-of-1 grid grid-wrap grid_align-center">
                                                <p className="text-color_white">Question {iCount + 1}</p>
                                            </div>
                                            <FormElement ref={field.ref} {...field} />
                                        </div>

                                        {iCount % 2 == '0' && device.width >= 860 && <div style={{ width: '2px', backgroundColor: 'var(--color-copper-medium)', margin: '-2px' }} className="margin-vertical_large"></div>}
                                    </>
                                );
                            })}
                        </div>
                    </div>
                    <div className="size_1-of-1 padding-around_large padding-bottom_x-small">
                        <Button variant="CopperBackgroundLight" type="button" label="Close" onClick={() => onClose()}></Button>
                    </div>
                </div>
                <div className={styles.modal_backdrop}></div>
            </div>
        ) : null;
    }

    if (isBrowser) {
        return ReactDOM.createPortal(componentBody, document.getElementById('modal-root'));
    } else {
        return null;
    }
}
