import { ipcRenderer } from 'electron';
import { Question, customEventTarget } from './interface';

window.addEventListener('DOMContentLoaded', async () => {
    const tableRef = document.getElementById('question-table') as HTMLTableElement;

    function addRow(question: Question): void {
        const newRow = tableRef.insertRow(-1);

        const newCell = newRow.insertCell(0);

        const newText = document.createElement('div');
        newText.innerText = question.question;
        newText.id = question.id + '';

        newText.addEventListener('click', async (ev: MouseEvent) => {
            const target = ev.target as customEventTarget;
            await ipcRenderer.invoke('window:answer', target.id);


        });

        newCell.appendChild(newText);
    }

    function addNoDataRow(): void {
        const newRow = tableRef.insertRow(-1);

        const newCell = newRow.insertCell(0);

        const newText = document.createElement('div');
        newText.innerText = 'No data';

        newCell.appendChild(newText);
    }

    const errMsgRef = document.getElementById('error-msg') as HTMLParagraphElement;
    const loaderRef = document.getElementById('loader') as HTMLDivElement;
    try {
        loaderRef.style.display = 'block';
        const response = await ipcRenderer.invoke('service:question');

        if (response.object === 'question' && response.rows) {
            response.rows.forEach((question: Question) => {
                addRow(question);
            });
        } else {
            addNoDataRow();
            errMsgRef.innerText = response.message as string;
        }

        loaderRef.style.display = 'none';
    } catch (error) {
        addNoDataRow();
        errMsgRef.innerText = error + '';
        loaderRef.style.display = 'none';
    }

    ipcRenderer.on('set-timeout-close-answer-window', (event: Electron.IpcRendererEvent, windowId: number) => {
        event.sender.sendTo(windowId, 'close-window-immediately');
    });
});