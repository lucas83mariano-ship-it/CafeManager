import "./icon-button.css";

function IconButton({

    children,
    onClick,
    title,

}) {

    return (

        <button
            type="button"
            onClick={onClick}
            title={title}
            className="icon-button"
        >

            {children}

        </button>

    );

}

export default IconButton;