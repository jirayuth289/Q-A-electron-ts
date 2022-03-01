import { contextBridge, ipcRenderer } from 'electron';
import { Question, ResponseQuestions, customEventTarget } from './interface';

contextBridge.exposeInMainWorld('myApi', {
    openAnswerWindow: async (questionId: number) => {
        await ipcRenderer.invoke('window:answer', questionId);
    },
    getQuestion: () => ipcRenderer.invoke('service:question')
});

window.addEventListener('DOMContentLoaded', async () => {
    const tableRef = document.getElementById('question-table') as HTMLTableElement;

    function addRow(question: Question) {
        // Insert a row at the end of the table
        const newRow = tableRef.insertRow(-1);

        // Insert a cell in the row at index 0
        const newCell = newRow.insertCell(0);

        // Append a div node to the cell
        const newText = document.createElement('div');
        newText.innerText = question.question;
        newText.id = question.id + '';

        newText.addEventListener('click', (ev: MouseEvent) => {
            const target = ev.target as customEventTarget;
            ipcRenderer.invoke('window:answer', target.id);
        });

        newCell.appendChild(newText);
    }

    function addNoDataRow() {
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
        const response = await ipcRenderer.invoke('service:question') as ResponseQuestions;

        if (response.object === 'question' && response.rows) {
            response.rows.forEach((question: Question) => {
                addRow(question);
            });
        } else {
            addNoDataRow();
            errMsgRef.innerText = response.message;
        }

        loaderRef.style.display = 'none';
    } catch (error) {
        addNoDataRow();
        errMsgRef.innerText = error + '';
        loaderRef.style.display = 'none';
    }

});