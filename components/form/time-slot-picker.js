import { forwardRef, useEffect, useState } from 'react';

function TimeSlotPicker(props, ref) {
    const [slots, setTimeSlots] = useState(['8 AM - 9 AM', '9 AM - 10 AM', '10 AM - 11 AM', '11 AM - 12 AM', '12 PM - 1 PM', '1 PM - 2 PM', '2 PM - 3 PM', '3 PM - 4 PM', '4 PM - 5 PM', '5 PM - 6 PM', '6 PM - 7 PM', '7 PM - 8 PM']);

    useEffect(() => {
        if (typeof props.items == 'function') {
            return fetchItems();
        }

        if (props.items) setTimeSlots(props.items);
    }, [props.items]);

    async function fetchItems() {
        setTimeSlots(await props.items());
    }

    async function handleChange($event) {
        if (typeof (props.onchange || props.onChange) === 'function') {
            (props.onchange || props.onChange)($event);
        }
    }

    return (
        <select className={props.className} ref={ref} name={props.label} id={props.id} onChange={handleChange} required={props.required} placeholder={props.placeholder} onFocus={props.onFocus} onBlur={props.onBlur} value={props.value}>
            <option value="-1">Select a Time</option>
            {slots.map((e) => (
                <option key={e.value || e} value={e.value || e}>
                    {e.label || e}
                </option>
            ))}
        </select>
    );
}

export default forwardRef(TimeSlotPicker);
