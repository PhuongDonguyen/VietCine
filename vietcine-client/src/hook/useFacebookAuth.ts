import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";

const useFacebookAuth = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const navigate = useNavigate();

    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useFacebookAuth must be used within an AuthProvider");
    }
    const { dispatch } = context;

    const signInWithFacebook = async () => {
        try {
            setIsLoading(true);
            const provider = new FacebookAuthProvider();
            const result = await signInWithPopup(auth, provider);
            const idToken = await result.user.getIdToken();

            console.log("Facebook sign-in result:", result);

            dispatch({
                type: "LOGIN",
                payload: {
                    user: { uid: null, name: result.user.displayName, email: result.user.email, avatar: result.user.photoURL },
                    token: idToken,
                    role: "USER",
                },
            });

            localStorage.setItem("user", JSON.stringify(result.user));
            localStorage.setItem("token", idToken);
            localStorage.setItem("role", "USER");

            navigate("/"); // Redirect to homepage on success
        } catch (err) {
            console.log({ loginError: err });
            const errorMsg = (err as Error).message;
            if (errorMsg.includes("auth/popup-closed-by-user")) {
                console.error("The popup was closed before completion.");
            } else if (errorMsg.includes("auth/account-exists-with-different-credential")) {
                console.error("auth/account-exists-with-different-credential");
                throw new Error("Email đã được sử dụng. Vui lòng thử lại với tài khoản khác.");
            } else {
                console.log(errorMsg);
                throw new Error("Đã có lỗi xảy ra. Vui lòng thử lại sau.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return { isLoading, signInWithFacebook };
};

export default useFacebookAuth;
