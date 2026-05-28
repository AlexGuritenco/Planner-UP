import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {CiUser} from "react-icons/ci";
import {MdEmail} from "react-icons/md";
import PasswordInput from "../components/PasswordHandler";
import {notification} from 'antd'
import {emailValidation, usernameValidation} from '../utils/validators.js';
import AuthLayout from "../components/AuthLayout.jsx";
import AuthInput from "../components/AuthInput";

export default function Signup() {
    const navigate = useNavigate()
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState({
        pass1: '',
        pass2: '',
    })

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!username.trim()) {
            notification.error({message: 'Username required'})
            return
        }
        if (!usernameValidation(username)) {
            notification.error({message: 'Please enter a valid username'})
            return
        }

        if (!email.trim()) {
            notification.error({message: 'Email required'})
            return
        }
        if (!emailValidation(email)) {
            notification.error({message: 'Please enter a valid email address'})
            return
        }
        if (!password.pass1.trim()) {
            notification.error({message: 'Password required'})
            return
        }
        if (password.pass1.length < 6 || password.pass1.length > 20) {
            notification.error({message: 'Password must be between 6-20 characters long'})
            return
        }

        if (!password.pass2.trim()) {
            notification.error({message: 'Confirm your password'})
            return
        }
        if (password.pass2.length < 6 || password.pass2.length > 20) {
            notification.error({message: 'Confirm password must be between 6-20 characters long'})
            return
        }

        if (password.pass1 !== password.pass2) {
            notification.error({message: 'Passwords must match'})
            return
        }

        navigate('/dashboard')
    }

    return (
        <AuthLayout title={"Start your planning journey today"} mode={"signup"}>
            <form onSubmit={handleSubmit} noValidate>
                <fieldset className="form__fieldset">
                    <legend className="form__legend">Create Account</legend>

                    <AuthInput
                        id={"username"}
                        name={"Username"}
                        icon={<CiUser className="form__icon form__icon--right"/>}
                    >
                        <input
                            className="form__input form__input--with-icon"
                            type="text"
                            id="username"
                            name="username"
                            placeholder="e.g. johndoe67"
                            required
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </AuthInput>

                    <AuthInput
                        id={"email"}
                        name={"Email"}
                        icon={<MdEmail className="form__icon form__icon--right"/>}
                        >
                        <input
                            className="form__input form__input--with-icon"
                            type="email"
                            id="email"
                            name="email"
                            placeholder="e.g. email@example.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </AuthInput>

                    <div className="form__group">
                        <label className="form__label" htmlFor="password">Password</label>
                        <PasswordInput
                            className="form__input"
                            type="password"
                            id="password"
                            name="pass1"
                            required
                            value={password.pass1}
                            onChange={(e) => setPassword({...password, pass1: e.target.value})}
                        />
                    </div>

                    <div className="form__group">
                        <label className="form__label" htmlFor="confirm_password">Confirm Password</label>
                        <PasswordInput
                            className="form__input"
                            type="password"
                            id="confirm_password"
                            name="pass2"
                            required
                            value={password.pass2}
                            onChange={(e) => setPassword({...password, pass2: e.target.value})}
                        />
                    </div>
                    <button className="button button--primary form__submit" type="submit">Sign Up</button>
                </fieldset>
            </form>
        </AuthLayout>
    )
}
