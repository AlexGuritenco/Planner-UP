import {useState} from 'react'
import {NavLink, useNavigate} from 'react-router-dom'
import ConfirmDialog from './ConfirmDialog'

export default function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false)
    const [logoutOpen, setLogoutOpen] = useState(false)
    const navigate = useNavigate()

    const handleLogout = () => {
        navigate('/')
    }

    return (
        <header className="site-header site-header--compact">
            <h1 className="site-header__title">Planner UP Dashboard</h1>
            <button
                className="hamburger-menu"
                aria-label="Toggle menu"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen(prev => !prev)}
            >
                ☰
            </button>
            <nav className="nav">
                <ul className={`nav__list${menuOpen ? ' active' : ''}`}>
                    <li><NavLink className="nav__link" to="/dashboard">Board</NavLink></li>
                    <li><NavLink className="nav__link" to="/agenda">Agenda</NavLink></li>
                    <li><NavLink className="nav__link" to="/stats">Your Weekly Goals</NavLink></li>
                    <li><NavLink className="nav__link" to="/account">Account</NavLink></li>
                    <li>
                        <button
                            className="nav__link"
                            onClick={() => setLogoutOpen(true)}
                            style={{background: 'none', border: 'none', cursor: 'pointer'}}
                        >
                            Log Out
                        </button>
                    </li>
                </ul>
            </nav>

            <ConfirmDialog
                open={logoutOpen}
                title="Log Out"
                message="Are you sure you want to log out?"
                onCancel={() => setLogoutOpen(false)}
                onOK={handleLogout}
            />
        </header>
    )
}
