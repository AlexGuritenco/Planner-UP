export default function CompletedRow({task, index, onDelete}) {
    return (
        <tr key={task.id}>
            <td>{index + 1}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>
                <button
                    type="button"
                    className="task-table__action task-table__action--delete"
                    onClick={() => onDelete(task.id)}
                >
                    Delete
                </button>
            </td>
        </tr>
    )
}