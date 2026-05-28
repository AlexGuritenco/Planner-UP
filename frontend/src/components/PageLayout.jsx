import NavBar from "./NavBar.jsx";
import Footer from "./Footer.jsx";

export default function PageLayout({children, className}) {
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