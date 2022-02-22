import { contextBridge, ipcRenderer } from 'electron'

contextBridge.exposeInMainWorld('answerApi', {
  handleAnswer: (callback: any) => ipcRenderer.on('show-answer', callback)
})

// window.addEventListener('DOMContentLoaded', () => {
//   console.log('DOMContentLoaded');
//     ipcRenderer.on('show-answer', (_event, value) => {
//       console.log('value:', value);       
//     })
// })