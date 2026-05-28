import {Link} from "react-router-dom";

export default function AuthLinks({mode}) {
    if (mode === "login") {
        return (
            <div className="auth-card__links">
                <p>Don't have an account? <Link to="/signup">Register</Link></p>
                <p>Go back to <Link to="/">Main</Link></p>
            </div>
        )
    } else if (mode === "signup") {
        return (
            <div className="auth-card__links">
                <p>Already have an account? <Link to="/login">Log in</Link></p>
                <p>Go back to <Link to="/">Main</Link></p>
            </div>
        )
    } else {
        return null;
    }
}
