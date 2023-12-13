import { useState, useRef, useImperativeHandle, forwardRef } from 'react';
import styles from './form-element.module.scss';

import validator from 'validator';
import { isValidPhoneNumber, AsYouType } from 'libphonenumber-js';
import Spinner from 'components/spinner';
import TimeSlotPicker from './time-slot-picker';
import Select from 'react-select';
import { useEffect } from 'react';

const FormElement = ({ id, label, name, type, required, ...attributes }, ref) => {
    const [inputValue, setInputValue] = useState(attributes.value || '');
    const [inputMinValue, setInputMinValue] = useState(attributes.MinValue || 0);
    const [inputMaxValue, setInputMaxValue] = useState(attributes.MaxValue || '');

    const [_options, setOptions] = useState(attributes.options || []);
    useEffect(() => {
        if (!attributes.options) {
            return;
        } else {
            setOptions(attributes.options);
        }
    }, [attributes.options]);

    const element = useRef();
    useImperativeHandle(ref, () => ({
        reportValidity: () => {
            return validate();
        },
        setOptions,
        value: inputValue,
        clear: () => {
            if (type === 'radio-button' || type === 'select') {
                setOptions(attributes.options);
            } else {
                element.current.value = '';
            }
        }
    }));

    const validate = () => {
        if ((required && validator.isEmpty(element.current.value)) || element.current.value == '-1') {
            setHasError(true);
            setErrorMessage('This field is required.');
            return false;
        }

        if (required && type === 'email' && !validator.isEmail(element.current.value)) {
            setHasError(true);
            setErrorMessage('Invalid Email.');
            return false;
        }

        if (required && type === 'phone' && !isValidPhoneNumber(element.current.value, 'ZA')) {
            setHasError(true);
            setErrorMessage('Invalid Phone Number.');
            return false;
        }

        setHasError(false);
        return true;
    };

    const containerClasses = [styles.container];

    if (attributes.variant === 'darkBackground') {
        containerClasses.push(styles.container_variant_darkBackground);
    }

    const controlClasses = [styles.control];

    const [hasError, setHasError] = useState(false);
    const [errorMessage, setErrorMessage] = useState('');
    if (hasError) {
        controlClasses.push(styles.control_hasError);
    }

    const handleFocus = () => {};
    const onBlur = () => {
        if (hasError) validate();
    };

    const formatPhoneNumber = (event) => {
        const formatter = new AsYouType('ZA');
        const formatted = formatter.input(event.currentTarget.value);
        event.currentTarget.value = formatted;
    };

    const handleChange = (event) => {
        setInputValue(event.currentTarget.value || '');
        if (typeof attributes.onChange === 'function') {
            attributes.onChange(event.currentTarget.value);
        }
    };

    const handleChangeSearchableDropdown = (event) => {
        setInputValue(event.value || '');
        if (typeof attributes.onChange === 'function') {
            attributes.onChange(event.value);
        }
    };

    const handleRadioButtonSelect = (event) => {
        try {
            const element = event.currentTarget.querySelector('input[type="radio"]');
            setInputValue(element.value);

            if (typeof attributes.onChange === 'function') {
                attributes.onChange(element.value);
            }

            setOptions(
                _options.map((x) => {
                    return { ...x, checked: x.value === element.value };
                })
            );
        } catch (err) {
            console.log(err);
        }
    };

    return (
        <>
            <div className={containerClasses.join(' ')}>
                {type != 'radio-button' && type != 'textarea' && label != '' && type != 'radio-button-downwards' && (
                    <label className={styles.label} htmlFor={id}>
                        {label}
                        {required && <sup>*</sup>}
                    </label>
                )}

                <div className={controlClasses.join(' ')}>
                    {attributes.loading && <Spinner type="roller" />}
                    {type === 'text' && <input ref={element} className={styles.control_text} id={id} name={name} type="text" autoComplete="off" value={inputValue} readOnly={attributes.readOnly} placeholder={attributes.placeholder} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} />}
                    {type === 'number' && <input ref={element} className={styles.control_text} id={id} name={name} type="number" autoComplete="off" value={inputValue} min={inputMinValue} max={inputMaxValue} readOnly={attributes.readOnly} placeholder={attributes.placeholder} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} />}
                    {type === 'password' && <input ref={element} className={styles.control_text} id={id} name={name} autoComplete={attributes.autoComplete} type="password" value={inputValue} readOnly={attributes.readOnly} placeholder={attributes.placeholder} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} />}
                    {type === 'phone' && <input ref={element} className={styles.control_text} id={id} name={name} type="phone" autoComplete="off" value={inputValue} placeholder={attributes.placeholder} readOnly={attributes.readOnly} onInput={formatPhoneNumber} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} />}
                    {type === 'id' && <input ref={element} className={styles.control_text} id={id} name={name} autoComplete="off" value={inputValue} readOnly={attributes.readOnly} placeholder={attributes.placeholder} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} type="text" />}
                    {type === 'email' && <input ref={element} className={styles.control_text} id={id} name={name} type="email" placeholder={attributes.placeholder} value={inputValue} onFocus={handleFocus} readOnly={attributes.readOnly} onBlur={onBlur} onChange={handleChange} autoComplete={attributes.autoComplete} />}
                    {type === 'textarea' && (
                        <>
                            <div id={id} className={styles.control_radioButton}>
                                {label != '' && (
                                    <label className={styles.label} style={{ width: '100%' }} htmlFor={id}>
                                        {label}
                                        {required && <sup>*</sup>}
                                    </label>
                                )}
                                <textarea ref={element} className={styles.control_textarea} id={id} name={name} rows={attributes.rows} placeholder={attributes.placeholder} onFocus={handleFocus} readOnly={attributes.readOnly} onBlur={onBlur} onChange={handleChange} style={{ resize: 'none', width: '100%' }}></textarea>
                            </div>
                        </>
                    )}
                    {type === 'radio-button' && (
                        <>
                            <div id={id} className={styles.control_radioButton}>
                                <label className={styles.label} style={{ width: '100%' }} htmlFor={id}>
                                    {label}
                                    {required && <sup>*</sup>}
                                </label>
                                {_options.map((x) => {
                                    return (
                                        <div className={styles.control_radioButton_optionWrapper} onClick={attributes.readOnly ? () => {} : handleRadioButtonSelect} key={x.value}>
                                            {x.checked == true && <input type="radio" name={name} value={x.value} onChange={handleChange} checked></input>}
                                            {x.checked != true && <input type="radio" name={name} value={x.value} onChange={handleChange} disabled={attributes.readOnly}></input>}

                                            <div className={`${styles.control_radioButton_option} ${x.checked ? styles.active : ''}`}>{x.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}

                    {type === 'radio-button-downwards' && (
                        <>
                            <div id={id} className={styles.control_radioButton} style={{ flexDirection: 'column' }}>
                                <label className={styles.label} style={{ width: '100%' }} htmlFor={id}>
                                    {label}
                                    {required && <sup>*</sup>}
                                </label>
                                {_options.map((x) => {
                                    return (
                                        <div className={styles.control_radioButton_optionWrapper} onClick={attributes.readOnly ? () => {} : handleRadioButtonSelect} key={x.value} style={{ padding: '0px' }}>
                                            {x.checked == true && <input type="radio" name={name} value={x.value} onChange={handleChange} checked></input>}
                                            {x.checked != true && <input type="radio" name={name} value={x.value} onChange={handleChange}></input>}

                                            <div className={`${styles.control_radioButton_option} ${x.checked ? styles.active : ''}`}>{x.label}</div>
                                        </div>
                                    );
                                })}
                            </div>
                        </>
                    )}
                    {type === 'date' && <input ref={element} className={styles.control_text} id={id} name={name} type="date" placeholder={attributes.placeholder} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} min={attributes.min} max={attributes.max} />}
                    {type === 'select' && (
                        <select ref={element} className={styles.control_text} id={id} name={name} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} defaultValue={inputValue} style={{ maxWidth: '280px', width: '100%' }}>
                            <option value="-1" disabled>
                                {attributes.placeholder || 'Select an option'}
                            </option>
                            {attributes.items &&
                                attributes.items.map((e) => (
                                    <option key={e.value || e} value={e.value || e} disabled={attributes.readOnly} className="text-color_black">
                                        {e.label || e}
                                    </option>
                                ))}
                            {attributes.options &&
                                attributes.options.map &&
                                attributes.options.map((e) => (
                                    <option key={e.value || e} value={e.value || e} disabled={attributes.readOnly} className="text-color_black">
                                        {e.label || e}
                                    </option>
                                ))}
                        </select>
                    )}
                    {type === 'time-slot' && <TimeSlotPicker ref={element} className={styles.control_text} id={id} name={name} placeholder={attributes.placeholder} onFocus={handleFocus} onBlur={onBlur} onChange={handleChange} items={attributes.items} value={inputValue} />}

                    {type === 'searchselect' && <Select ref={element} classNamePrefix="SearchableSelect" className={styles.control_text} instanceId={id} name={name} onFocus={handleFocus} onBlur={onBlur} onChange={handleChangeSearchableDropdown} options={attributes.items} />}
                </div>
                {hasError && <div className={styles.errorLabel}>{errorMessage}</div>}
            </div>
        </>
    );
};

export default forwardRef(FormElement);
