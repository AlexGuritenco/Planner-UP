export default function TaskTable({
    sectionID,
    text,
    columns,
    items,
    colSpanNr,
    message,
    renderRow,
}){
    return(
        <section className="dashboard-section" id={sectionID}>
            <h2 className="dashboard-section__title">{text}</h2>
            <table className="task-table">
                <thead>
                <tr>
                    {columns.map(column => (
                        <th key={column}>{column}</th>
                    ))}
                </tr>
                </thead>
                <tbody>
                {items.length === 0 ? (
                    <tr>
                        <td colSpan={colSpanNr} style={{textAlign: 'center', color: 'var(--text-muted)'}}>
                            {message}
                        </td>
                    </tr>
                ) : (
                    items.map(renderRow)
                )}
                </tbody>
            </table>
        </section>
    )
}