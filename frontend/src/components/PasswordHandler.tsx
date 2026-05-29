import {useState} from 'react';
// open eye icon
import {BsFillEyeFill, BsFillEyeSlashFill} from "react-icons/bs";
// close eye icon
import '../App';
import React from "react";

type PasswordHandlerProps = {
    className?: string;
    id?: string;
    name?: string;
    required: boolean
    value: string;
    onChange:  React.ChangeEventHandler<HTMLInputElement, HTMLInputElement>
    type?: string;
    autoComplete?: string;
}

export default function PasswordHandler({value, onChange, type, ...rest}: PasswordHandlerProps) {
    const [show, setShow] = useState(false);

    return (
        <div className="password-wrapper">
            <input className="form__input form__input--with-icon"
                   type={show ? "text" : (type ?? "password")}
                   value={value}
                   onChange={onChange}
                   {...rest}
            />
            <button
                type="button"
                className="eye-btn"
                onClick={() => setShow((show) => !show)}
            >
                {show ? <BsFillEyeSlashFill/> : <BsFillEyeFill/>}
            </button>
        </div>
    );
}
