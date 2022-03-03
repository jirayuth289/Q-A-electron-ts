import { BrowserWindow } from 'electron';
import path from 'path';

import { getAnswerByQuestionIdService } from '../../service';

const updateData = async (questionId: number, answerWindow: Electron.BrowserWindow): Promise<void> => {
    try {
        answerWindow.webContents.send('loading', true);
        const result = await getAnswerByQuestionIdService(questionId);
        answerWindow.title = 'answer-window';

        answerWindow.webContents.send('loading', false);
        answerWindow.webContents.send('show-answer', result);
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
};

class AnswerWindow {
    private answerWindow: BrowserWindow | undefined = undefined;

    constructor() {
        this.createWindow();
    }

    get webContentId(): number {
        return this.answerWindow?.webContents.id as number;
    }

    get browserWindow(): BrowserWindow {
        return this.answerWindow as BrowserWindow;
    }

    public async showAnswerByQuestionId(questionId: number) {
        this.answerWindow?.show();

        await updateData(questionId, this.answerWindow as BrowserWindow);
    }

    public close() {
        this.answerWindow?.close();
    }

    private createWindow() {
        this.answerWindow = new BrowserWindow({
            width: 800,
            height: 600,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload.js'),
            },
        });

        this.answerWindow.loadFile(path.join(__dirname, '..', '..', '..', 'answer.html'));

        this.answerWindow.webContents.on('did-finish-load', async () => {
            if (!this.answerWindow) {
                throw new Error('the window of answer is not defined');
            }
        });
    }
}

export { AnswerWindow };
