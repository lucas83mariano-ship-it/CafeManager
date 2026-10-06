import { forwardRef } from "react";
import "./button.css";

const Button = forwardRef(function Button({

    children,
    onClick,
    type = "button",
    disabled = false,

}, ref) {

    return (

        <button
            ref={ref}
            className="btn"
            type={type}
            onClick={onClick}
            disabled={disabled}
        >

            {children}

        </button>

    );

});

export default Button;