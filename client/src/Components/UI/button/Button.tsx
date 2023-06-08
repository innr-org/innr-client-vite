import React, { ReactNode } from 'react'
import classes from './Button.module.css'

interface Button{
    children?: ReactNode;
    class?: String;
    props?: any;
}

function Button({children, className, ...props}:Button) {
    return (
        <button {...props} className={classes.btn + " " + className}>{children}</button>
    );
}

export default Button;