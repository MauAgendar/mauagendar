import React from "react";
import { BrowserRouter as Router, Route, Link, Routes } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import "./index.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Calendario from "./components/Calendario";
import Compromissos from "./components/Compromissos";
import Perfil from "./components/Perfil";

const App = () => {
    return (
        <>
            <Router>
                <Navbar />
                <Routes>
                    <Route path="/" Component={Home} />
                    <Route path="/login" Component={Login} />
                    <Route path="/register" Component={Register} />
                    <Route path="/profile" Component={Perfil} />
                    <Route path="/calendar" Component={Calendario} />
                    <Route path="/appointments" Component={Compromissos} />
                </Routes>
                <Footer />
            </Router>
        </>
    );
};

export default App;
