import { BrowserWindow, IpcMainInvokeEvent } from 'electron';
import path from 'path';
import { ResponseJson } from '../../interface';

import { getAnswerByQuestionIdService } from '../../service';

export const openAnswerWindow = (event: IpcMainInvokeEvent, questionId: number) => {
    let answerWindow: BrowserWindow | null = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        },
    });

    // answerWindow.webContents.openDevTools();
    answerWindow.loadFile(path.join(__dirname, '..', '..','..', 'answer.html'));

    //Destroy the BrowserWindow Instance on close
    answerWindow.on('close', function () {
        answerWindow = null;
    });

    answerWindow.webContents.on('did-finish-load', async () => {
        if (!answerWindow) {
            throw new Error('"answerWindow" is not defined');
        }
        try {
            const result: ResponseJson = await getAnswerByQuestionIdService(questionId) as ResponseJson;

            answerWindow.show();
            answerWindow.webContents.send('show-answer', result.answer);
        } catch (error) {
            throw error;
        }
    });

    return { questionId }
}
