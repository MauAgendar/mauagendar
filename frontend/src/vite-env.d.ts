/// <reference types="vite/client" />
interface ImportMetaEnv {
    VITE_AUTH_PORT: string;
    VITE_CALENDAR_PORT: string;
}

interface ImportMeta {
    readonly env: ImportMetaEnv;
}
