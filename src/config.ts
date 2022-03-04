import fs from 'fs/promises';
import path from 'path';
import { ConfigEnv } from "./interface";

export const readFileConfig = async (): Promise<ConfigEnv | undefined> => {
    try {
        const filePath = path.join(__dirname, '..', 'config', 'config.json');
        const fileContent = await fs.readFile(filePath, { encoding: 'utf-8' });
        const fileReadResult =  JSON.parse(fileContent) as ConfigEnv;

        return {
            hostname: fileReadResult.hostname,
            port: fileReadResult.port
        };
    } catch (error) {
        if (error instanceof Error) throw error;
        else {
            throw error;
        }
    }
};
