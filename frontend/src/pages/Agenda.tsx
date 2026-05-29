import PageLayout from '../components/PageLayout'
import {getDueBucket} from '../utils/dateUtils'
import DeadlineCard from '../components/DeadlineCard'
import type {Task} from "../components/types";

type AgendaGroup = {
    label: string
    tasks: Task[]
}

export default function Agenda({tasks}: { tasks: Task[] }) {
    const groups: AgendaGroup[] = [
        {label: 'Overdue', tasks: []},
        {label: 'Today', tasks: []},
        {label: 'Tomorrow', tasks: []},
        {label: 'Next Week', tasks: []},
        {label: 'Later', tasks: []},
    ]

    tasks
        .filter(task => !task.done)
        .forEach((task) => {
            const bucket = getDueBucket(task.due)
            const group = groups.find(({label}) => label === bucket)

            if (group) {
                group.tasks.push(task)
            }
        })

    return (
        <PageLayout className={"page-content"}>
            <h2 className="dashboard-section__title">Incoming Deadlines</h2>
            {groups.every(g => g.tasks.length === 0) ? (
                <p style={{color: 'var(--text-muted)', marginTop: '1rem'}}>
                    No pending deadlines
                </p>
            ) : (
                groups.map(group => group.tasks.length > 0 && (
                    <section className="agenda-group" key={group.label}>
                        <h3 className="agenda-group__heading">{group.label}</h3>
                        {group.tasks.map(task => (
                            <DeadlineCard key={task.id} task={task}/>
                        ))}
                    </section>
                ))
            )}
        </PageLayout>
    )
}
