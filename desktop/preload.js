contextBridge.exposeInMainWorld('electronAPI', {
  downloadVideo: (url) => ipcRenderer.invoke('video:download', url),
  clipVideo: (data) => ipcRenderer.invoke('video:clip', data),
  transcribeVideo: (path) => ipcRenderer.invoke('video:transcribe', path),
  describeFrame: (data) => ipcRenderer.invoke('video:describe', data),
  onProgress: (callback) => ipcRenderer.on('video:progress', (event, value) => callback(value))
});
