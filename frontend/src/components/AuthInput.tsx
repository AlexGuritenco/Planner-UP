import type { ReactNode } from "react";

type AuthInputProps = {
    id:number | string,
    name: string,
    children: ReactNode ,
    icon?: ReactNode,
}

export default function AuthInput({
    id,
    name,
    children ,
    icon,
}: AuthInputProps){
    return (
        <div className="form__group">
            <label className="form__label" htmlFor={String(id)}>{name}</label>
            <div className="form__input-wrapper">
                {children}
                {icon}
            </div>
        </div>
    )
}
