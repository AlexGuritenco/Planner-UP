import {useState} from 'react'
import PageLayout from "../components/PageLayout.jsx";
import PasswordInput from "../components/PasswordHandler";
import {usernameValidation} from '../utils/validators.js';
import {CiUser} from "react-icons/ci";
import AuthInput from "../components/AuthInput";
import {notification} from 'antd'

export default function Account() {
    const [form, setForm] = useState({
        username: '',
        pass1: '',
        pass2: ''
    })
    const [saved, setSaved] = useState(false)

    const handleChange = (e) => {
        setSaved(false)
        setForm(prev => ({...prev, [e.target.name]: e.target.value}))
    }
    const handleSubmit = (e) => {
        e.preventDefault()
        if (!form.username.trim()) {
            notification.error({message: 'Username required'})
            return
        }
        if (!usernameValidation(form.username)) {
            notification.error({message: 'Please enter a valid username'})
            return
        }
        if (!form.pass1.trim()) {
            notification.error({message: 'Password required'})
            return
        }
        if (form.pass1.length < 6 || form.pass1.length > 20) {
            notification.error({message: 'Password must be between 6-20 characters long'})
            return
        }

        if (!form.pass2.trim()) {
            notification.error({message: 'Confirm your password'})
            return
        }
        if (form.pass2.length < 6 || form.pass2.length > 20) {
            notification.error({message: 'Confirm password must be between 6-20 characters long'})
            return
        }

        if (form.pass1 !== form.pass2) {
            notification.error({message: 'Passwords must match'})
            return
        }

        setSaved(true)
        notification.success({ message: 'Changes saved' })
    }

    return (
        <PageLayout className={"page-content"}>
            <div className="auth-page">
                <section className="auth-card" id="account-info">
                    <h2 className="auth-card__title">Account Information</h2>
                    <form onSubmit={handleSubmit} noValidate>
                        <fieldset className="form__fieldset">
                            <legend className="form__legend">Account Information</legend>

                            <AuthInput
                                id={"username"}
                                name={"username"}
                                icon={<CiUser className="form__icon form__icon--right"/>}
                            >
                                <input
                                    className="form__input form__input--with-icon"
                                    type="text"
                                    id="username"
                                    name="username"
                                    placeholder="e.g. johndoe67"
                                    required
                                    value={form.username}
                                    onChange={handleChange}
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
                                    value={form.pass1}
                                    onChange={handleChange}
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
                                    value={form.pass2}
                                    onChange={handleChange}
                                />
                            </div>

                            <button className="button button--primary form__submit" type="submit">
                                Save Changes
                            </button>
                        </fieldset>
                    </form>
                </section>
            </div>
        </PageLayout>
    )
}
