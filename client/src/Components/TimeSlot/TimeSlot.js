import React from 'react';
import cl from './TimeSlot.module.css'

function TimeSlot({children}) {
    return (
        <div className={cl.timeslot}>{children}</div>
    );
}

export default TimeSlot;
