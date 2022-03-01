import { BrowserWindow } from 'electron';
import path from 'path';
import { ResponseAnswers } from '../../interface';

import { getAnswerByQuestionIdService } from '../../service';

const forceSingleChildWindown = () => {
    if (BrowserWindow.getAllWindows().length > 1) {
        BrowserWindow.getAllWindows().forEach((window: Electron.BrowserWindow) => {
            if (window.id !== 1) {
                window.close();
            }
        });
    }
};

export const openAnswerWindow = (event: Electron.IpcMainInvokeEvent, questionId: number) => {
    forceSingleChildWindown();

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
    answerWindow.loadFile(path.join(__dirname, '..', '..', '..', 'answer.html'));

    //Destroy the BrowserWindow Instance on close
    answerWindow.on('close', function () {
        answerWindow = null;
    });

    answerWindow.webContents.on('did-finish-load', async () => {
        if (!answerWindow) {
            throw new Error('the window of answer is not defined');
        }

        answerWindow.show();

        try {
            answerWindow.webContents.send('loading', true);
            const result = await getAnswerByQuestionIdService(questionId) as ResponseAnswers;
            answerWindow.title = result.row.answer;

            answerWindow.webContents.send('loading', false);
            answerWindow.webContents.send('show-answer', result);

            setTimeout(()=> {
                answerWindow?.close();
            }, 10000);
        } catch (error) {
            answerWindow.webContents.send('loading', false);
            const errMsg = error + '';

            if (errMsg.indexOf('net::ERR_CONNECTION_REFUSED') !== -1) {
                answerWindow.webContents.send('show-answer', {
                    object: 'error',
                    message: 'the application cannot retrieve an answer from the server.'
                });
            } else {
                answerWindow.webContents.send('show-answer', {
                    object: 'error',
                    message: errMsg
                });
            }
        }
    });

    return { questionId };
};
