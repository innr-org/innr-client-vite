import React from 'react';
import cl from './TimeSlot.module.css'

function TimeSlot({children, ...props}) {
    return (
        <div className={cl.timeslot} {...props}>{children}</div>
    );
}

export default TimeSlot;
