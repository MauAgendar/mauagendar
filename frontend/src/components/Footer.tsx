import {
    Instagram,
    WhatsApp,
    Twitter,
    LinkedIn,
    Facebook,
} from "@mui/icons-material";

import Logo from "/mauagendar.png";

export default function Footer(): JSX.Element {
    return (
        <div className="bg-gray-900 flex flex-col items-center lg:flex-row lg:justify-between  py-10 px-12">
            <div>
                <img src={Logo} alt="Logo MauAgendar" className="w-32 h" />
                <div className="flex items-center gap-2 py-7 lg:py-0">
                    <h1>Acesse nossas redes: </h1>
                    <Instagram />
                    <WhatsApp />
                    <Twitter />
                    <LinkedIn />
                    <Facebook />
                </div>
            </div>

            <div className="flex text-sm md:text-lg gap-4 lg:flex-col lg:gap-0">
                <p> O melhor sistema de agendamento do Brasil.</p>
            </div>
        </div>
    );
}
