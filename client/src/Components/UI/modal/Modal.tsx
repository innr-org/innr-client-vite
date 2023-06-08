import React, { ReactNode } from 'react';
import classes from "./Modal.module.css";

interface ModalProps {
    children: ReactNode;
    props: any;
    visible: boolean;
    className: String;
    setVisible: (visible: boolean) => void;
}

function Modal({ children, visible, setVisible, className, ...props }: ModalProps) {
    const rootClasses = [classes.myModal];

    if (visible) {
        rootClasses.push(classes.active);
    }

    return (
        <div className={rootClasses.join(' ')}
             {...props}
        >
            <div
                className={classes.myModalContent + " " + className}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
};

export default Modal;