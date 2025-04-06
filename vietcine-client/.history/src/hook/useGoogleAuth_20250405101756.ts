import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";

const useGoogleAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useGoogleAuth must be used within an AuthProvider");
    }
    const { dispatch } = context;

    const signInWithGoogle = async () => {
        try {
            setIsLoading(true);
            const provider = new GoogleAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            dispatch({
                type: "LOGIN",
                payload: {
                    user: { name: result.user.displayName, email: result.user.email },
                    token: idToken,
                    role: "USER",
                },
            });

            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", idToken);
            localStorage.setItem("role", "USER");

            navigate("/"); // Redirect to homepage on success
        } catch (err) {
            const errorMsg = (err as Error).message;
            console.error("Google sign-in error:", errorMsg);
            setError(errorMsg);
        } finally {
            setIsLoading(false);
        }
    };

    return { error, isLoading, signInWithGoogle };
};

export default useGoogleAuth;
