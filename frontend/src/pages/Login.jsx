import {useState} from 'react'
import {useNavigate} from 'react-router-dom'
import {MdEmail} from "react-icons/md";
import PasswordInput from "../components/PasswordHandler";
import {notification} from 'antd'
import {emailValidation} from '../utils/validators.js';
import AuthLayout from '../components/AuthLayout';
import AuthInput from "../components/AuthInput";

export default function Login() {
    const navigate = useNavigate()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault()

        if (!email.trim()) {
            notification.error({message: 'Email required'})
            return
        }
        if (!emailValidation(email)) {
            notification.error({message: 'Please enter a valid email address'})
            return
        }
        if (!password.trim()) {
            notification.error({message: 'Password required'})
            return
        }
        if (password.length < 6 || password.length > 20) {
            notification.error({message: 'Password must be between 6-20 characters long'})
            return
        }

        navigate('/dashboard')
    }

    return (
        <AuthLayout title={"Welcome Back"} mode={"login"} >
            <form onSubmit={handleSubmit} noValidate>
                <fieldset className="form__fieldset">
                    <legend className="form__legend">Login Information</legend>

                    <AuthInput
                        id={"email"}
                        name={"Email"}
                        icon={<MdEmail className="form__icon form__icon--right"/>}
                        >
                        <input
                            className="form__input form__input--with-icon"
                            type="email"
                            autoComplete="email"
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
                            autoComplete="current-password"
                            type="password"
                            id="password"
                            name="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    <button className="button button--primary form__submit" type="submit">Log In</button>
                </fieldset>
            </form>
        </AuthLayout>
    )
}
