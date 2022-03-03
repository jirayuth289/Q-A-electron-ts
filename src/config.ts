import fs from 'fs';
import path from 'path';
import { ConfigEnv } from "./interface";

export const readFileConfig = async (): Promise<ConfigEnv | undefined> => {
    try {
        const filePath = path.join(__dirname, '..', 'config', 'config.json');
        const fileReadResult = await new Promise((resolve, reject) => {
            fs.readFile(filePath, (errReadFile: NodeJS.ErrnoException | null, data: Buffer) => {
                if (errReadFile) {
                    reject(errReadFile);
                } else {
                    resolve(JSON.parse(data.toString('utf-8')));
                }
            });
        }) as ConfigEnv;

        return {
            hostname: fileReadResult.hostname,
            port: fileReadResult.port
        };
    } catch (error) {
        if (error instanceof Error) throw error;
    }
};
