import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'path';

import { getQuestionService } from './service';
import { openAnswerWindow } from './windows/answer';

class QnAApplication {
    private mainWindow: BrowserWindow | undefined = undefined;

    constructor() {
        // This method will be called when the Electron has finished
        // initialization and is ready to create browser windows.
        // Some APIs can only be used after this event occurs.
        app.whenReady().then(async () => {
            this.createWindow();

            this.addHandlerInvoke();
            this.setAppEmitted();
        })
    }

    private setAppEmitted() {
        // Quit when all windows are closed.
        app.on('window-all-closed', () => {
            // On macOS it is common for applications and their menu bar
            // to stay active until the user quits explicitly with Cmd + Q
            if (process.platform !== 'darwin') {
                app.quit()
            }
        })

        app.on('activate', () => {
            // On macOS it's common to re-create a window in the app when the
            // dock icon is clicked and there are no other windows open.
            if (BrowserWindow.getAllWindows().length === 0) {
                this.createWindow()
            }
        })
    }

    private addHandlerInvoke() {
        ipcMain.handle('window:answer', openAnswerWindow);
        ipcMain.handle('service:question', (ev) => getQuestionService())
    }

    private createWindow() {
        // Create the browser window.
        this.mainWindow = new BrowserWindow({
            width: 1280,
            height: 760,
            webPreferences: {
                nodeIntegration: true,
                preload: path.join(__dirname, 'preload'),
            }
        })

        // and load the index.html of the app.
        this.mainWindow.loadFile(path.join(__dirname, '..', 'index.html'))

        // Open the DevTools.
        // win.webContents.openDevTools();

        //Quit app when main BrowserWindow Instance is closed
        this.mainWindow.on('closed', function () {
            app.quit();
        });
    }
}

new QnAApplication()