import AuthLinks from "./AuthLinks";
import Footer from "./Footer";
import React from "react";

type AuthLayoutProps = {
    children: React.ReactNode;
    title: string;
    mode: 'login' | 'signup';
}

export default function AuthLayout({
    children,
    title,
    mode,
}: AuthLayoutProps) {
    return (
        <div className="page">
            <header className="site-header">
                <h1 className="site-header__title">Planner UP</h1>
                <p className="site-header__subtitle">Your personal schedule planner</p>
            </header>

            <main className="auth-page">
                <section className="auth-card">
                    <h2 className="auth-card__title">{title}</h2>
                    {children}
                    <AuthLinks mode={mode}/>
                </section>
            </main>
            <Footer/>
        </div>
    )
}