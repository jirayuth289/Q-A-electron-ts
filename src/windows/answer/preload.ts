import { ipcRenderer } from 'electron';
import { ResponseAnswers } from '../../interface';

window.addEventListener('DOMContentLoaded', () => {
  const questionRef = document.getElementById('question') as HTMLElement;

  ipcRenderer.on('loading', (_event: Electron.IpcRendererEvent, loading: boolean) => {
    const loaderRef = document.getElementById('loader') as HTMLDivElement;
    if (loading) {
      loaderRef.style.display = 'block';
    } else {
      loaderRef.style.display = 'none';
    }
  });

  ipcRenderer.on('show-answer', (_event: Electron.IpcRendererEvent, response: ResponseAnswers) => {
    const errMsgRef = document.getElementById('error-msg') as HTMLParagraphElement;

    if (response.object === 'answer' && response.row) {
      questionRef.innerText = response.row.answer;
    } else {
      errMsgRef.innerText = response.message;
    }
  });
});