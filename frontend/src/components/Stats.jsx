export default function Stats({target, className, name}) {
    return (
        <div className={className}>
            <span className="stat-card__value">{target}</span>
            <span className="stat-card__label">{name}</span>
        </div>
    )
}