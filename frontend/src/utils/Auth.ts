
import { useJwt } from "react-jwt";

export const isAuthenticated = (): string | boolean => {
    const token: string | null = localStorage.getItem("token");
    if (token !== null && token !== undefined) {
        try {
            const { decodedToken } = useJwt(token);
            if (
                decodedToken !== null &&
                typeof decodedToken === "object" &&
                "email" in decodedToken
            ) {
                const email: string = decodedToken.email as string;
                return email;
            }
        } catch (err) {
            return false;
        }
    }

    return false; // Return false if token is not present or decodedToken is null or undefined
};
