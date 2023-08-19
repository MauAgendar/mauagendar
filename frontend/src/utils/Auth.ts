import axios from "axios";
import { useJwt } from "react-jwt";

interface User {
    email: string;
    user_id: number;
}

export const isAuthenticated = (token: string | null): User => {
    if (token !== null && token !== undefined) {
        try {
            const { decodedToken } = useJwt(token);

            if (
                decodedToken !== null &&
                typeof decodedToken === "object" &&
                "email" in decodedToken
            ) {
                const user: User = decodedToken as User;

                // Set the token on Axios headers
                axios.defaults.headers.common[
                    "Authorization"
                ] = `Bearer ${token}`;

                return user;
            }
        } catch (err) {
            console.error(err);
        }
    }

    // If token is not present or decodedToken is null or undefined, clear the Authorization header
    delete axios.defaults.headers.common["Authorization"];

    return { email: "", user_id: 0 };
};
