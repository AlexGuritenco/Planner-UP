export default function AuthInput({
    id,
    name,
    children,
    icon,
}){
    return (
        <div className="form__group">
            <label className="form__label" htmlFor={id}>{name}</label>
            <div className="form__input-wrapper">
                {children}
                {icon}
            </div>
        </div>
    )
}
