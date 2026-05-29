import NavBar from "./NavBar";
import Footer from "./Footer";
import React from "react";

type PageLayoutProps = {
    children: React.ReactNode;
    className?: string;
}

export default function PageLayout({children, className}: PageLayoutProps) {
    return (
        <div className="page">
            <NavBar/>
            <main className={className}>
                {children}
            </main>
            <Footer/>
        </div>
    );
}