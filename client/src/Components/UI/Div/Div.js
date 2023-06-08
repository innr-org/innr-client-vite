import React from 'react';
import cl from './Div.module.css'

function Div({children, className}) {
    return (
        <div className={cl.div + " " + className}>{children}</div>
    );
}

export default Div;
