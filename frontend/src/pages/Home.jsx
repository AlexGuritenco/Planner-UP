import {Link} from 'react-router-dom'

export default function Home() {
    return (
        <div className="page">
            <header className="site-header">
                <h1 className="site-header__title">Welcome to the Planner UP website</h1>
                <h2 className="site-header__subtitle">Your personal tool for being organized</h2>
            </header>
            <main className="site-content">
                <article className="hero">
                    <h2 className="hero__title">What is Planner UP?</h2>
                    <p className="hero__text">
                        Planner UP is a web application designed to help you manage your schedule and stay organized.
                        With its user-friendly interface and powerful features, you can create, edit, and manage your
                        schedule. Ensuring that you never miss a deadline or miss a key meeting.
                        It is time to control your schedule and stay organized.
                    </p>
                </article>
                <section className="hero__card hero__card--actions">
                    <h2 className="hero__title">Get started</h2>
                    <p className="hero__text">Create an account or log in to continue.</p>
                    <nav className="hero__actions" aria-label="Authentication links">
                        <Link className="button button--primary" to="/signup">Sign Up</Link>
                        <Link className="button button--secondary" to="/login">Log in</Link>
                    </nav>
                </section>
            </main>
            <footer>
                <p>&copy;2026 - Project</p>
            </footer>
        </div>
    )
}
