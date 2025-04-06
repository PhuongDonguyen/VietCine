import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../config/firebase.config";

const useGoogleAuth = () => {
    const [error, setError] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const { dispatch } = useContext(AuthContext);

    const signInWithGoogle = async () => {
        setError(null);
        setIsLoading(true);

        const result = await signInWithPopup(auth, googleProvider);
        console.log({ result });
    }

    return { error, isLoading, signInWithGoogle };
}

export default useGoogleAuth;