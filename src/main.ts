import 'dotenv/config';
import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';
import { ResponseQuestions } from './interface';

import { getQuestionService } from './service';
import { AnswerWindow } from './windows/answer';

class QnAApplication {
    private mainWindow: BrowserWindow | undefined = undefined;
    private childWindow: AnswerWindow | undefined = undefined;
    private childTimeout: NodeJS.Timeout | undefined = undefined;

    constructor() {
        app.whenReady().then(async () => {
            this.createWindow();

            this.addHandlerInvoke();
            this.setAppEmitted();
        });
    }

    private setAppEmitted() {
        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit();
            }
        });

        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow();
            }
        });
    }

    private async retrieveQuestion(): Promise<ResponseQuestions> {
        try {
            return await getQuestionService();
        } catch (error) {
            const errMsg = error + '';

            if (errMsg.indexOf('net::ERR_CONNECTION_REFUSED') !== -1) {
                return {
                    object: 'error',
                    message: 'the application cannot retrieve questions from the server.'
                };
            } else {
                return {
                    object: 'error',
                    message: errMsg
                };
            }
        }
    }

    private addHandlerInvoke(): void {
        ipcMain.handle('service:question', this.retrieveQuestion);
        ipcMain.handle('window:answer', async (event: Electron.IpcMainInvokeEvent, questionId: number): Promise<void> => {
            if (this.childWindow) {
                clearTimeout(this.childTimeout as NodeJS.Timeout);
                await this.childWindow.showAnswerByQuestionId(questionId);
            } else {
                this.childWindow = new AnswerWindow();
                await this.childWindow.showAnswerByQuestionId(questionId);
            }

            this.childTimeout = setTimeout(() => {
                event.sender.send('set-timeout-close-answer-window', this.childWindow?.webContentId);
            }, 10000);

            this.childWindow.browserWindow.on('close', () => {
                clearTimeout(this.childTimeout as NodeJS.Timeout);
                this.childWindow = undefined;
                this.childTimeout = undefined;
            });
        });

        ipcMain.handle('close', () => {
            this.childWindow?.close();
        });
    }

    private createWindow(): void {
        this.mainWindow = new BrowserWindow({
            title: 'main',
            width: 1280,
            height: 760,
            show: false,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload'),
            }
        });

        this.mainWindow.loadFile(path.join(__dirname, '..', 'index.html'));

        //Quit app when main BrowserWindow Instance is closed
        this.mainWindow.on('closed', function () {
            app.quit();
        });

        this.mainWindow.once('ready-to-show', () => {
            this.mainWindow?.show();
        });
    }
}

new QnAApplication();
