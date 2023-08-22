import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

export default function Login(): JSX.Element {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const formData = {
            email,
            password,
        };

        try {
            const response = await axios.post(
                `http://localhost:${import.meta.env.VITE_AUTH_PORT}/user/login`,
                formData,
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const token = response.data.token;

            // Store JWT token in session storage
            sessionStorage.setItem("token", token);

            navigate("/");
            window.location.reload();
        } catch (error: any) {
            if (error.response) {
                window.alert("Erro ao logar: " + error.response.data.error);
            } else {
                window.alert("Erro ao logar: " + error.message);
            }
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    return (
        <div className="relative flex flex-col justify-center min-h-screen overflow-hidden bg-gray-900">
            <div className="w-full p-6 m-auto bg-gray-800 rounded-md shadow-md lg:max-w-xl">
                <h1 className="text-3xl font-semibold text-center text-purple-500">
                    Logar no MauAgendar
                </h1>
                <form className="mt-6" onSubmit={handleSubmit}>
                    <div className="mb-2">
                        <label
                            htmlFor="email"
                            className="block text-sm font-semibold text-gray-200"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            placeholder="Digite seu email"
                            className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            value={email}
                            onChange={handleEmailChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="password"
                            className="block text-sm font-semibold text-gray-200"
                        >
                            Senha
                        </label>
                        <input
                            type="password"
                            placeholder="Digite sua senha"
                            className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            value={password}
                            onChange={handlePasswordChange}
                        />
                    </div>
                    <Link
                        to="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                        className="text-s text-purple-300 hover:underline"
                    >
                        Esqueceu a Senha?
                    </Link>
                    <div className="mt-6">
                        <button
                            type="submit"
                            className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600"
                        >
                            Login
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-s font-light text-center text-gray-300">
                    Não tem uma conta?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-purple-300 hover:underline"
                    >
                        Cadastre-se
                    </Link>
                </p>
            </div>
        </div>
    );
}
