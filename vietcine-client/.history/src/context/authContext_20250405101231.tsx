import { createContext, useReducer, useEffect, useState, ReactNode, Dispatch } from "react";

interface User {
    uid: string;
    name: string;
    email: string;
    avatar: string;
}

interface AuthState {
    user: unknown | null;
    token: sting | null;
    role: string | null;
}

type AuthAction =
    | { type: "LOGIN"; payload: { user: unknown; token: string; role: string } }
    | { type: "LOGOUT" }
    | { type: "UPDATE"; payload: unknown };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
    switch (action.type) {
        case "LOGIN":
            return {
                user: action.payload.user,
                token: action.payload.token,
                role: action.payload.role,
            };
        case "LOGOUT":
            return {
                user: null,
                token: null,
                role: null,
            };
        case "UPDATE":
            return {
                ...state,
                user: state.user ? { ...state.user, ...action.payload } : null,
            };
        default:
            return state;
    }
};

interface AuthContextProps extends AuthState {
    dispatch: Dispatch<AuthAction>;
    loadingAuth: boolean;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

interface AuthContextProviderProps {
    children: ReactNode;
}

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
    const [state, dispatch] = useReducer(authReducer, {
        user: null,
        token: null,
        role: null,
    });

    const [loadingAuth, setLoadingAuth] = useState(true);

    useEffect(() => {
        try {
            const user = JSON.parse(localStorage.getItem("user") || "null") as Record<string, any> | null;
            const token = localStorage.getItem("token");
            const role = localStorage.getItem("role");
            if (user && token && role) {
                console.log("Dispatching LOGIN action");
                dispatch({ type: "LOGIN", payload: { user, token, role } });
            }
        } catch (err) {
            console.log("Failed to parse data from LocalStorage: ", (err as Error).message);
        } finally {
            setLoadingAuth(false);
        }
    }, []);

    useEffect(() => {
        if (state.user) localStorage.setItem("user", JSON.stringify(state.user));
    }, [state.user]);

    console.log("Auth state:", state);

    return (
        <AuthContext.Provider value={{ ...state, dispatch, loadingAuth }}>
            {children}
        </AuthContext.Provider>
    );
};
