import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.config";

const useGoogleAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useGoogleAuth must be used within an AuthProvider");
    }
    const { dispatch } = context;

    const signInWithGoogle = async () => {
        setIsLoading(true);

        const result = await signInWithPopup(auth, googleProvider);
        const credential = googleProvider.credentialFromResult(result);
        console.log({ result });
    }

    return { error, isLoading, signInWithGoogle };
}

export default useGoogleAuth;