declare global {
    namespace NodeJS {
        interface ProcessEnv {
            token: string;
            channelId: string;
        }
    }
}

export {};