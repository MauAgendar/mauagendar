import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login(): JSX.Element {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [passwordsMatch, setPasswordsMatch] = useState(true);
    const [phonenumber, setPhonenumber] = useState("");
    const [name, setName] = useState("");

    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setPasswordsMatch(false);
            return;
        }

        const formData = {
            email,
            password,
            phonenumber,
            name,
        };

        try {
            const response = await fetch(
                "https://mauagendar-auth.onrender.com/user/register",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (response.ok) {
                const data = await response.json();
                const token = data.token;

                // Armazena JWT no localStorage
                localStorage.setItem("token", token);
                navigate("/");
                window.location.reload();
            } else {
                const errorData = await response.json();
                window.alert("Erro ao registrar: " + errorData.error);
            }
        } catch (error) {
            window.alert("Erro ao registrar: " + error);
        }
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setPassword(e.target.value);
    };

    const handleConfirmPasswordChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setConfirmPassword(e.target.value);
    };

    const handlePhonenumberChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ) => {
        setPhonenumber(e.target.value);
    };

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
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
                            htmlFor="name"
                            className="block text-sm font-semibold text-gray-200"
                        >
                            Nome
                        </label>
                        <input
                            type="text"
                            placeholder="Digite seu nome"
                            className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            value={name}
                            onChange={handleNameChange}
                        />
                    </div>
                    <div className="mb-2">
                        <label
                            htmlFor="phonenumber"
                            className="block text-sm font-semibold text-gray-200"
                        >
                            Telefone
                        </label>
                        <input
                            type="tel"
                            placeholder="(11)91234-5678"
                            className="block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            value={phonenumber}
                            onChange={handlePhonenumberChange}
                        />
                    </div>
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
                    <div className="mb-2">
                        <label
                            htmlFor="confirmPassword"
                            className="block text-sm font-semibold text-gray-200"
                        >
                            Confirmar senha
                        </label>
                        <input
                            type="password"
                            placeholder="Digite sua senha novamente"
                            className={`block w-full px-4 py-2 mt-2 text-purple-300 bg-gray-700 border rounded-md focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40 ${
                                passwordsMatch ? "" : "border-red-500"
                            }`}
                            value={confirmPassword}
                            onChange={handleConfirmPasswordChange}
                        />
                        {!passwordsMatch && (
                            <p className="text-red-500 text-sm mt-1">
                                As senhas não coincidem. Tente novamente.
                            </p>
                        )}
                    </div>
                    <div className="mt-6">
                        <button className="w-full px-4 py-2 tracking-wide text-white transition-colors duration-200 transform bg-purple-700 rounded-md hover:bg-purple-600 focus:outline-none focus:bg-purple-600">
                            Cadastre-se
                        </button>
                    </div>
                </form>

                <p className="mt-8 text-s font-light text-center text-gray-300">
                    {" "}
                    Já tem uma conta?{" "}
                    <Link
                        to="/login"
                        className="font-medium text-purple-300 hover:underline"
                    >
                        Logar
                    </Link>
                </p>
            </div>
        </div>
    );
}
