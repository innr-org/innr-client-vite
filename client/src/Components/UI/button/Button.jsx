import classes from './Button.module.css'


function Button({children, className, ...props}) {
    return (
        <button {...props} className={classes.btn + " " + className}>{children}</button>
    );
}

export default Button;
