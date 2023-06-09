import React, { FC } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import "./index.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Calendario from "./components/Calendario";
import Appointments from "./components/Compromissos";
import Perfil from "./components/Perfil";
import { isAuthenticated } from "./utils/Auth";
interface User {
    email: string | null | undefined;
    user_id: number;
}

const RequireAuth: FC<{ children: React.ReactElement }> = ({ children }) => {
    const token = localStorage.getItem("token");
    const user = isAuthenticated(token);
    const userIsLogged = user !== null;

    if (!userIsLogged) {
        console.log("User is not authenticated");
        return <Login />;
    }

    console.log(`User authenticated: ${user.email} ${user.user_id}`);
    localStorage.setItem("user_id", user.user_id.toString());
    return children;
};
const App = () => {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/profile"
                        element={
                            <RequireAuth>
                                <Perfil />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/calendar"
                        element={
                            <RequireAuth>
                                <Calendario
                                    userId={Number(
                                        localStorage.getItem("user_id")
                                    )}
                                />
                            </RequireAuth>
                        }
                    />
                    <Route
                        path="/appointments"
                        element={
                            <RequireAuth>
                                <Appointments
                                    userId={Number(
                                        localStorage.getItem("user_id")
                                    )}
                                />
                            </RequireAuth>
                        }
                    />
                </Routes>
                <Footer />
            </Router>
        </>
    );
};

export default App;
