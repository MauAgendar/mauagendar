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
                return user;
            }
        } catch (err) {
            console.error(err);
        }
    }

    return { email: "", user_id: 0 }; // Return a default user object if token is not present or decodedToken is null or undefined
};
