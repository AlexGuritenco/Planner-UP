import React from "react";
import type {Task} from "./types";

type CompletedRowProps = {
    task: Task;
    index: number;
    onDelete: (taskId: string) => void;
}

export default function CompletedRow({task, index, onDelete}: CompletedRowProps) {
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