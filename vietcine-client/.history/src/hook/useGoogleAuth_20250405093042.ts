import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { signInWithPopup } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { GoogleAuthProvider } from "firebase/auth";

const useGoogleAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useGoogleAuth must be used within an AuthProvider");
    }
    const { dispatch } = context;

    const signInWithGoogle = async () => {
        try {setIsLoading(true);
        const googleProvider = new GoogleAuthProvider();
        const result = await signInWithPopup(auth, googleProvider);
        const credential = GoogleAuthProvider.credentialFromResult(result);
        const idToken = await result?.user?.getIdToken();
        console.log({ result });
        console.log({ credential });
        console.log({ idToken });
        dispatch({ type: "LOGIN", payload: { user: result.user, token: idToken, role: "USER" } });
        localStorage.setItem("user", JSON.stringify(result.user));
        localStorage.setItem("token", idToken);
        localStorage.setItem("role", "USER");
        setIsLoading(false);

        }
        
    }

    return { error, isLoading, signInWithGoogle };
}

export default useGoogleAuth;