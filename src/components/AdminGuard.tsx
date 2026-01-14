import { ReactNode, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "@/contexts/AuthContext";

interface AdminGuardProps {
    children: ReactNode;
}

export const AdminGuard = ({ children }: AdminGuardProps) => {
    const { user, profile, loading, isAdmin } = useAuthContext();
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) {
            if (!user) {
                navigate("/auth");
            } else if (!isAdmin) {
                navigate("/");
            }
        }
    }, [user, isAdmin, loading, navigate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    if (user && isAdmin) {
        return <>{children}</>;
    }

    return null;
};

export default AdminGuard;
