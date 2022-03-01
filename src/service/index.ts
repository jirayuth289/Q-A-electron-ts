import { net } from 'electron';
import config from '../config';

export const getQuestionService = () => {
    const result = new Promise((resolve, reject) => {
        const request = net.request({
            hostname: config.hostname,
            port: config.port,
            path: "/question",
            method: 'get'
        });

        request.on('response', (response) => {

            const chunks: Buffer[] = [];
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                const data = Buffer.concat(chunks).toString();

                resolve(JSON.parse(data));
            });

            response.on('error', reject);
        });

        request.on('error', reject);
        request.end();
    });

    return result;
};

export const getAnswerByQuestionIdService = (questionId: number) => {
    const result = new Promise((resolve, reject) => {
        const request = net.request({
            hostname: config.hostname,
            port: config.port,
            path: `/question/${questionId}/answer`,
            method: 'get'
        });

        request.on('response', (response) => {
            const chunks: Buffer[] = [];
            response.on('data', (chunk) => {
                chunks.push(chunk);
            });

            response.on('end', () => {
                const data = Buffer.concat(chunks).toString();

                resolve(JSON.parse(data));
            });

            response.on('error', reject);
        });

        request.on('error', reject);
        request.end();
    });

    return result;
};