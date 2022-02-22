import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('myApi', {
    openAnswerWindow: async (questionId: number) => {
        const result = await ipcRenderer.invoke('window:answer', questionId);
    },
    getQuestion: () => ipcRenderer.invoke('service:question')
});