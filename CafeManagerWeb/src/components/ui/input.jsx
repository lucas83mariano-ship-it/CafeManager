import "./input.css";

function Input({

    label,
    id,
    destaque = false,
    erro = "",
    mensagem = "",
    className = "",
    ...props

}) {

    return (

        <div className="input-group">

            <label htmlFor={id}>

                {label}

            </label>
            
            {erro && (

                <p className="input-error">
                
                    {erro}

                </p>

            )}

            {destaque && mensagem && (

                <p className="input-message">
                
                    {mensagem}

                </p>

            )}

            <input
                id={id}
                className={`
                    ${className} 
                    ${destaque ? "input-destaque" : ""} 
                    ${erro ? "input-erro" : ""} `}
                {...props}
            />

        </div>

    );

}

export default Input;