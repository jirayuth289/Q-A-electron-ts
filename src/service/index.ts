import { net } from 'electron';
import { readFileConfig } from '../config';
import { ConfigEnv, ResponseAnswers, ResponseQuestions } from '../interface';

let config: ConfigEnv;

readFileConfig().then((result) => {
    config = result as ConfigEnv;
})
    .catch(error => {
        console.log(error);
    });

export const getQuestionService = (): Promise<ResponseQuestions> => {
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
    }) as Promise<ResponseQuestions>;

    return result;
};

export const getAnswerByQuestionIdService = (questionId: number): Promise<ResponseAnswers> => {
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
    }) as Promise<ResponseAnswers>;

    return result;
};