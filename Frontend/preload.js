// preload.js
const { contextBridge, ipcRenderer } = require('electron');

console.log('preload.js loaded')

contextBridge.exposeInMainWorld('electron', {
    minimize: () => {
        try {
            ipcRenderer.send('minimize-window');
        } catch (error) {
            console.error('Error minimizing window:', error);
        }
    },
    maximize: () => {
        try {
            ipcRenderer.send('maximize-window');
        } catch (error) {
            console.error('Error maximizing window:', error);
        }
    },
    close: () => {
        try {
            ipcRenderer.send('close-window');
        } catch (error) {
            console.error('Error closing window:', error);
        }
    },
});
