import { Outlet, Navigate } from "react-router-dom";
import UserNavbar from "../components/UserNavbar";

const UserLayout = () => {
    const isAuthenticated = !!localStorage.getItem("token");

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="min-h-screen bg-[#0a0f1d]">
            <UserNavbar />
            <main className="pt-24">
                <Outlet /> {/* This is where ProductGallery will render */}
            </main>
        </div>
    );
};

export default UserLayout;