import PageLayout from '../components/PageLayout.jsx'
import Stats from '../components/Stats.jsx'

export default function StatsCard({tasks}) {
    const target = tasks.length
    const completed = tasks.filter(t => t.done).length
    const remaining = target - completed
    const percentage = target === 0 ? 0 : Math.round((completed / target) * 100)

    return (
        <PageLayout className={"page-content"}>
            <section className="stats-section" id="goal-overview">
                <h2 className="dashboard-section__title">This Week's Progress</h2>
                <div className="stats-grid">
                    <Stats
                        name="Target"
                        target={target}
                        className="stat-card stat-card--target"
                    />
                    <Stats
                        name={"Completed"}
                        target={completed}
                        className={"stat-card stat-card--done"}
                    />
                    <Stats
                        name={"Remaining"}
                        target={remaining}
                        className={"stat-card stat-card--remaining"}
                    />
                </div>
                <div className="progress-block">
                    <label className="progress-block__label" htmlFor="weekly-progress">
                        Goal Progress
                    </label>
                    <progress
                        className="progress-bar"
                        id="weekly-progress"
                        value={completed}
                        max={target === 0 ? 1 : target}
                    />
                    <span className="progress-block__pct">{percentage}%</span>
                </div>
            </section>
        </PageLayout>
    )
}
