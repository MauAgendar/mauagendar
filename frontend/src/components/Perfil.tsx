import { isAuthenticated } from "../utils/Auth";
export default function Perfil() {
    const email = isAuthenticated();
    return (
        <div className="flex flex-col items-center justify-center h-screen bg-gray-900">
            <h1 className="text-5xl font-bold">Perfil</h1>
            <h2 className="text-2xl font-bold">Bem vindo, {email} </h2>
            <button
                className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
                type="button"
                onClick={() => {
                    localStorage.removeItem("token");
                    window.location.href = "/";
                }}
            >
                Logout
            </button>
        </div>
    );
}