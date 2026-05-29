import {formatDueDate} from "../utils/dateUtils";
import type {Task} from "./types";

type DeadlineCardProps = {
    task: Task;
}

export default function DeadlineCard({task}: DeadlineCardProps) {
    return (
        <article className="deadline-card" key={task.id}>
            <h4 className="deadline-card__title">{task.title}</h4>
            <p className="deadline-card__detail">{task.description}</p>
            <p className="deadline-card__detail">Due: {formatDueDate(task.due)}</p>
            <p className="deadline-card__status deadline-card__status--pending">
                Status: Pending
            </p>
        </article>
    )
}
