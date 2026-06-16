import {formatDueDate} from "../utils/dateUtils";
import type {Task} from "./types";

type TaskRowProps = {
    task: Task;
    index: number;
    onEdit: (task: Task) => void;
    onToggle: () => void;
    onDelete: (taskId: string) => void;
}

export default function TaskRow({task, index, onEdit, onToggle, onDelete}: TaskRowProps) {
    return (
        <tr key={task.id}>
            <td>{index + 1}</td>
            <td>{task.title}</td>
            <td>{task.description}</td>
            <td>{formatDueDate(task.due)}</td>
            <td>
                <input
                    type="checkbox"
                    checked={task.done}
                    onChange={onToggle}
                />
            </td>
            <td>
                <button
                    type="button"
                    className="task-table__action task-table__action--edit"
                    onClick={() => onEdit(task)}
                >
                    Edit
                </button>
                {' | '}
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