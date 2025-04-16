import { useContext, useState } from "react";
import { AuthContext } from "../context/authContext";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../config/firebase.config";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const useGoogleAuth = () => {
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

            console.log(result);

            const user = {
                fullName: result.user.displayName,
                email: result.user.email,
                avatar: result.user.photoURL,
                providerId: result.providerId,
                uid: result.user.uid,
                idToken
            };

            // 🔐 Send request to backend to verify user
            const response = await axios.post(
                import.meta.env.VITE_SERVER_API_URL + "/auth/google",
                { ...user },
                {
                    headers: {
                        Authorization: `Bearer ${idToken}`,
                    },
                }
            );

            if (response.status !== 200) {
                throw new Error("Đã xảy ra lỗi đăng nhập.");
            }

            const responseUser = response.data.data.user;
            console.log("Response user:", responseUser);

            dispatch({
                type: "LOGIN",
                payload: {
                    user: { ...responseUser },
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

    return { isLoading, signInWithGoogle };
};

export default useGoogleAuth;
