import React, {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import PageLayout from "../components/PageLayout";
import PasswordInput from "../components/PasswordHandler";
import {usernameValidation} from '../utils/validators';
import {CiUser} from "react-icons/ci";
import AuthInput from "../components/AuthInput";
import {notification} from 'antd';
import api from '../api';
import {useAuth} from '../AuthContext';
import ConfirmDialog from "../components/ConfirmDialog";

export default function Account() {
    const {user, logout} = useAuth();
    const userId = user?._id;
    const navigate = useNavigate();
    const [form, setForm] = useState({
        username: '',
        pass1: '',
        pass2: ''
    })
    const [saved, setSaved] = useState(false)
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);

    useEffect(() => {
        if (!userId) return;

        api.get(`/account/${userId}`)
            .then(res => setForm(prev => ({...prev, username: res.data.username})));
    }, [userId]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSaved(false)
        setForm(prev => ({...prev, [e.target.name]: e.target.value}))
    };
    const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!form.username.trim()) {
            notification.error({title: 'Username required'})
            return
        }
        if (!usernameValidation(form.username)) {
            notification.error({title: 'Please enter a valid username'})
            return
        }
        if (!form.pass1.trim()) {
            notification.error({title: 'Password required'})
            return
        }
        if (form.pass1.length < 6 || form.pass1.length > 20) {
            notification.error({title: 'Password must be between 6-20 characters long'})
            return
        }

        if (!form.pass2.trim()) {
            notification.error({title: 'Confirm your password'})
            return
        }
        if (form.pass2.length < 6 || form.pass2.length > 20) {
            notification.error({title: 'Confirm password must be between 6-20 characters long'})
            return
        }

        if (form.pass1 !== form.pass2) {
            notification.error({title: 'Passwords must match'})
            return
        }
        try {
            await api.patch(`/account/${userId}`, {
                username: form.username,
                password: form.pass1,
                pass2: form.pass2,
            });
            setSaved(true);
            notification.success({title: 'Account updated successfully'});
        } catch (error: any) {
            notification.error({title: error.response?.data?.message ?? 'Failed to update account'});
        }
    };

    const handleDeleteAccount = async () => {
        try {
            await api.delete(`/account/${userId}`);
            logout();
            navigate('/');
        } catch (error: any) {
            notification.error({title: error.response?.data?.message ?? 'Failed to delete account'});
        } finally {
            setShowDeleteDialog(false);
        }
    };

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

                    <div className="danger-account-delete">
                        <h3 className='danger-account-delete-h3'>Danger Zone</h3>
                        <p className='danger-account-delete-p'>
                            Permanently delete your account. <br/>
                            This cannot be undone.
                        </p>
                        <button
                            className="button button--thirdly form__submit"
                            style={{backgroundColor: '#dc2626', color: 'white'}}
                            type="button"
                            onClick={() => setShowDeleteDialog(true)}
                        >
                            Delete Account
                        </button>
                    </div>
                </section>
            </div>

            <ConfirmDialog
                open={showDeleteDialog}
                title="Delete Account"
                message="Are you sure you want to delete your account? All your tasks will be permanently deleted. This action cannot be undone."
                confirmLabel="Delete Account"
                onCancel={() => setShowDeleteDialog(false)}
                onOK={handleDeleteAccount}
            />
        </PageLayout>
    );
}
